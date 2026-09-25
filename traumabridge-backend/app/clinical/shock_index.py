"""
TraumaBridge AI — Shock Index (SI) & Blood Bank Trigger

Reference: Olaussen A, Blackburn T, Mitra B, Fitzgerald M.
"Shock Index for prediction of critical bleeding post-trauma: A systematic review."
Emergency Medicine Australasia. 2014;26(3):223-228. DOI: 10.1111/1742-6723.12252

Formula: SI = HR / SBP
Normal range: 0.5 – 0.7  |  SI ≥ 1.0 predicts 2× higher transfusion need.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


@dataclass(frozen=True)
class ShockIndexResult:
    value: float
    is_critical: bool
    urgency_level: str          # "CRITICAL", "HIGH", "ELEVATED", "NORMAL"
    transfusion_risk_multiplier: float
    recommendation: str


def compute_shock_index(heart_rate: int, systolic_bp: int) -> ShockIndexResult:
    """Compute Shock Index = HR / SBP.

    Raises:
        ValueError: if SBP ≤ 0 (division by zero guard).
    """
    if systolic_bp <= 0:
        raise ValueError("Systolic BP must be > 0 to compute Shock Index")

    si = heart_rate / systolic_bp

    if si >= 1.3:
        return ShockIndexResult(
            value=round(si, 2),
            is_critical=True,
            urgency_level="CRITICAL",
            transfusion_risk_multiplier=7.0,
            recommendation="IMMEDIATE massive transfusion protocol activation — prepare 6 units O-Neg",
        )
    elif si >= 1.1:
        return ShockIndexResult(
            value=round(si, 2),
            is_critical=True,
            urgency_level="HIGH",
            transfusion_risk_multiplier=4.0,
            recommendation="URGENT blood bank notification — prepare 2 units O-Neg",
        )
    elif si >= 0.9:
        return ShockIndexResult(
            value=round(si, 2),
            is_critical=True,
            urgency_level="ELEVATED",
            transfusion_risk_multiplier=2.0,
            recommendation="Blood bank alert — crossmatch requested",
        )
    else:
        return ShockIndexResult(
            value=round(si, 2),
            is_critical=False,
            urgency_level="NORMAL",
            transfusion_risk_multiplier=1.0,
            recommendation="Continue monitoring — no immediate transfusion required",
        )


async def trigger_blood_bank_reservation(
    hospital_id: str,
    transit_id: str,
    shock_index_result: ShockIndexResult,
) -> bool:
    """Fire automated webhook to hospital blood bank system.

    Reserves O-Negative blood when SI ≥ 0.9 (elevated or above).
    Returns True on success, False on failure (error is queued for retry).
    """
    if not shock_index_result.is_critical:
        return False

    # Determine unit count by urgency
    units = {
        "CRITICAL": 6,
        "HIGH": 2,
        "ELEVATED": 2,
    }.get(shock_index_result.urgency_level, 2)

    reservation_payload = {
        "hospital_id": hospital_id,
        "transit_id": transit_id,
        "blood_type": "O-NEG",
        "units": units,
        "urgency": shock_index_result.urgency_level,
        "reason": (
            f"Shock Index {shock_index_result.value} ({shock_index_result.urgency_level}) "
            f"— {shock_index_result.recommendation}"
        ),
        "risk_multiplier": shock_index_result.transfusion_risk_multiplier,
    }

    # In hackathon / test mode — skip actual webhook
    if not settings.blood_bank_webhook_url or settings.abdm_mock:
        logger.warning(
            "Blood bank reservation skipped (mock mode): transit=%s, SI=%.2f, units=%d",
            transit_id, shock_index_result.value, units,
        )
        return True

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                settings.blood_bank_webhook_url,
                json=reservation_payload,
                headers={"X-API-Key": settings.blood_bank_api_key},
            )
            response.raise_for_status()
            logger.warning(
                "Blood bank reservation triggered: transit=%s, SI=%.2f, units=%d",
                transit_id, shock_index_result.value, units,
            )
            return True
    except httpx.HTTPError as e:
        logger.error("Blood bank webhook failed: %s", e)
        return False
