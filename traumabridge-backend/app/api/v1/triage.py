"""
TraumaBridge AI — Core Triage Pipeline API

Endpoint: POST /api/v1/triage/analyze

This is the central intelligence endpoint.
1. Takes a MIST transcript (voice-to-text) + vitals snapshot
2. LLM extracts structured entities (NO clinical decisions made by LLM)
3. Deterministic Python runs: RTS, Shock Index, CPSS, NELS Rule Engine
4. Returns computed scores + Clinical Support Card
5. Publishes result to hospital ED via Redis Pub/Sub
"""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.ai.mist_extractor import extract_mist_entities, MISTExtractionError
from app.clinical.rts import compute_rts
from app.clinical.shock_index import compute_shock_index, trigger_blood_bank_reservation
from app.clinical.cpss import compute_cpss
from app.clinical.nels_engine import evaluate_nels_protocol
from app.schemas.mist import MISTExtractionResult

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Request / Response schemas ────────────────────────────────────────────────

class TriageRequest(BaseModel):
    transit_id: str = Field(..., description="Unique transit ID (TBA-YYYYMMDD-XXXX)")
    hospital_id: str = Field(..., description="Receiving hospital UUID")
    mist_transcript: str = Field(
        ..., max_length=4000, description="Raw voice-to-text MIST report"
    )
    # Optional vitals override (if from hardware monitor, not voice)
    manual_gcs: Optional[int] = Field(None, ge=3, le=15)
    manual_sbp: Optional[int] = Field(None, ge=0, le=300)
    manual_hr: Optional[int] = Field(None, ge=0, le=300)
    manual_rr: Optional[int] = Field(None, ge=0, le=60)
    manual_spo2: Optional[int] = Field(None, ge=0, le=100)
    # CPSS flags
    facial_droop: bool = False
    arm_drift: bool = False
    speech_abnormal: bool = False


class ClinicalScores(BaseModel):
    rts: Optional[float] = None
    t_rts: Optional[int] = None
    shock_index: Optional[float] = None
    shock_critical: bool = False
    shock_urgency: Optional[str] = None
    cpss_score: Optional[int] = None
    cpss_stroke_probability: Optional[float] = None
    cpss_positive: bool = False


class TriageResponse(BaseModel):
    transit_id: str
    extraction_confidence: float
    mist: MISTExtractionResult
    scores: ClinicalScores
    nels_protocol: Optional[str] = None       # Protocol enum name or None
    nels_card_title: Optional[str] = None
    nels_actions: list[str] = []
    nels_urgency: Optional[str] = None
    nels_color: Optional[str] = None
    blood_bank_triggered: bool = False
    triage_priority: str = "P3"               # P1/P2/P3/P4
    interpretation_summary: str = ""


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post(
    "/analyze",
    response_model=TriageResponse,
    summary="Full MIST-to-triage pipeline",
    description=(
        "Accepts a paramedic MIST report transcript. Runs Groq LLM entity extraction "
        "(zero clinical AI), then feeds tokens into deterministic RTS/SI/CPSS/NELS engines. "
        "Returns computed clinical scores and NELS Clinical Support Card."
    ),
)
async def analyze_triage(request: TriageRequest) -> TriageResponse:
    # ── Step 1: LLM entity extraction ─────────────────────────────────────────
    try:
        mist = await extract_mist_entities(request.mist_transcript)
    except MISTExtractionError as e:
        logger.error("MIST extraction failed for transit=%s: %s", request.transit_id, e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"MIST extraction failed: {e}",
        )

    # Override extracted vitals with manual hardware readings if provided
    gcs = request.manual_gcs or mist.signs.gcs
    sbp = request.manual_sbp or mist.signs.systolic_bp
    hr  = request.manual_hr  or mist.signs.heart_rate
    rr  = request.manual_rr  or mist.signs.respiratory_rate
    spo2 = request.manual_spo2 or mist.signs.spo2

    scores = ClinicalScores()

    # ── Step 2: Revised Trauma Score ─────────────────────────────────────────
    if gcs is not None and sbp is not None and rr is not None:
        rts_result = compute_rts(gcs=gcs, sbp=sbp, rr=rr)
        scores.rts = rts_result.rts
        scores.t_rts = rts_result.t_rts

    # ── Step 3: Shock Index ───────────────────────────────────────────────────
    blood_bank_triggered = False
    if hr is not None and sbp is not None and sbp > 0:
        si_result = compute_shock_index(heart_rate=hr, systolic_bp=sbp)
        scores.shock_index = si_result.value
        scores.shock_critical = si_result.is_critical
        scores.shock_urgency = si_result.urgency_level

        if si_result.is_critical:
            blood_bank_triggered = await trigger_blood_bank_reservation(
                hospital_id=request.hospital_id,
                transit_id=request.transit_id,
                shock_index_result=si_result,
            )

    # ── Step 4: CPSS (Stroke Scale) ───────────────────────────────────────────
    cpss_result = compute_cpss(
        facial_droop=request.facial_droop,
        arm_drift=request.arm_drift,
        speech_abnormal=request.speech_abnormal,
    )
    scores.cpss_score = cpss_result.total_score
    scores.cpss_stroke_probability = cpss_result.stroke_probability
    scores.cpss_positive = cpss_result.is_positive

    # ── Step 5: NELS Rule Engine ──────────────────────────────────────────────
    nels_card = evaluate_nels_protocol(
        injuries=mist.injuries,
        systolic_bp=sbp,
        heart_rate=hr,
        gcs=gcs,
        spo2=spo2,
    )

    # ── Step 6: Determine triage priority ─────────────────────────────────────
    priority = _compute_priority(scores, nels_card)

    # ── Step 7: Publish to hospital ED via Redis Pub/Sub ──────────────────────
    try:
        from app.services.telemetry_publisher import publish_hospital_alert
        await publish_hospital_alert(
            hospital_id=request.hospital_id,
            alert={
                "type": "TRIAGE_COMPLETE",
                "transit_id": request.transit_id,
                "priority": priority,
                "rts": scores.rts,
                "shock_index": scores.shock_index,
                "nels_protocol": nels_card.protocol.value if nels_card else None,
                "nels_urgency": nels_card.urgency if nels_card else None,
            },
        )
    except Exception as e:
        logger.warning("Failed to publish triage alert: %s", e)

    return TriageResponse(
        transit_id=request.transit_id,
        extraction_confidence=mist.confidence,
        mist=mist,
        scores=scores,
        nels_protocol=nels_card.protocol.value if nels_card else None,
        nels_card_title=nels_card.display_title if nels_card else None,
        nels_actions=list(nels_card.recommended_actions) if nels_card else [],
        nels_urgency=nels_card.urgency if nels_card else None,
        nels_color=nels_card.color_code if nels_card else "#4CAF50",
        blood_bank_triggered=blood_bank_triggered,
        triage_priority=priority,
        interpretation_summary=_build_summary(scores, nels_card),
    )


def _compute_priority(scores: ClinicalScores, nels_card) -> str:
    """Compute triage priority P1–P4 from computed scores."""
    if nels_card and nels_card.urgency == "IMMEDIATE":
        return "P1"
    if scores.t_rts is not None and scores.t_rts < 6:
        return "P1"
    if scores.shock_urgency in ("CRITICAL", "HIGH"):
        return "P1"
    if nels_card and nels_card.urgency == "URGENT":
        return "P2"
    if scores.t_rts is not None and scores.t_rts < 11:
        return "P2"
    if scores.cpss_positive:
        return "P2"
    return "P3"


def _build_summary(scores: ClinicalScores, nels_card) -> str:
    parts = []
    if scores.rts is not None:
        parts.append(f"RTS={scores.rts:.2f} (T-RTS={scores.t_rts})")
    if scores.shock_index is not None:
        parts.append(f"SI={scores.shock_index:.2f} [{scores.shock_urgency}]")
    if scores.cpss_positive:
        parts.append(f"CPSS={scores.cpss_score} (stroke p={scores.cpss_stroke_probability:.0%})")
    if nels_card:
        parts.append(f"NELS={nels_card.protocol.value}")
    return " | ".join(parts) if parts else "Insufficient data for scoring"
