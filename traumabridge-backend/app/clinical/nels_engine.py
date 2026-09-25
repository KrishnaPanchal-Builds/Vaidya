"""
TraumaBridge AI — NELS (National Emergency Life Support) Rule Engine

Reference: Ministry of Health and Family Welfare (MoHFW), Government of India.
"National Emergency Life Support (NELS) Courses." Launched 2022.

CRITICAL DESIGN PRINCIPLE:
  The LLM NEVER makes clinical decisions.
  The LLM only extracts tokens from voice/text.
  Those tokens are fed into this HARDCODED PYTHON RULE ENGINE.
  The rule engine maps symptoms → Clinical Support Cards.
  Zero AI inference in clinical decision-making.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class NELSProtocol(str, Enum):
    HEMORRHAGIC_SHOCK = "HEMORRHAGIC_SHOCK"
    TENSION_PNEUMOTHORAX = "TENSION_PNEUMOTHORAX"
    CARDIAC_TAMPONADE = "CARDIAC_TAMPONADE"
    TRAUMATIC_BRAIN_INJURY = "TRAUMATIC_BRAIN_INJURY"
    BURNS = "BURNS"
    PEDIATRIC_TRAUMA = "PEDIATRIC_TRAUMA"


@dataclass(frozen=True)
class ClinicalSupportCard:
    protocol: NELSProtocol
    display_title: str
    recommended_actions: list[str]
    contraindications: list[str]
    urgency: str       # "IMMEDIATE", "URGENT", "STANDARD"
    reference: str
    color_code: str    # UI hex color — "#FF0000" for IMMEDIATE


# ── NELS Protocol Library ──────────────────────────────────────────────────────
NELS_RULES: dict[NELSProtocol, ClinicalSupportCard] = {

    NELSProtocol.HEMORRHAGIC_SHOCK: ClinicalSupportCard(
        protocol=NELSProtocol.HEMORRHAGIC_SHOCK,
        display_title="NELS Protocol Alert: Suspected Hemorrhagic Shock",
        recommended_actions=[
            "Establish 2 large-bore IV lines (14G or 16G)",
            "Administer 1 Litre Ringer's Lactate bolus (adult)",
            "Apply direct pressure to external bleeding sites",
            "Activate Massive Transfusion Protocol if SI > 1.0",
            "Administer Tranexamic Acid 1g IV over 10 minutes (if < 3 hrs from injury)",
            "Keep patient warm — hypothermia worsens coagulopathy",
        ],
        contraindications=["Do not delay transport for IV access"],
        urgency="IMMEDIATE",
        reference="NELS Hemorrhagic Shock Protocol, MoHFW India 2022",
        color_code="#D32F2F",
    ),

    NELSProtocol.TENSION_PNEUMOTHORAX: ClinicalSupportCard(
        protocol=NELSProtocol.TENSION_PNEUMOTHORAX,
        display_title="NELS Protocol Alert: Suspected Tension Pneumothorax",
        recommended_actions=[
            "Administer high-flow oxygen (15L via NRB mask)",
            "Perform needle decompression: 2nd ICS, mid-clavicular line, 14G needle",
            "Prepare for chest tube insertion at destination",
            "Monitor SpO2 continuously — target > 94%",
            "Reassess breath sounds bilaterally",
        ],
        contraindications=["Do not delay decompression for imaging"],
        urgency="IMMEDIATE",
        reference="NELS Trauma Protocol, MoHFW India 2022",
        color_code="#D32F2F",
    ),

    NELSProtocol.CARDIAC_TAMPONADE: ClinicalSupportCard(
        protocol=NELSProtocol.CARDIAC_TAMPONADE,
        display_title="NELS Protocol Alert: Suspected Cardiac Tamponade",
        recommended_actions=[
            "High-flow oxygen (15L NRB)",
            "IV access — do NOT administer large fluid bolus (worsens tamponade)",
            "Rapid transport — pericardiocentesis required at hospital",
            "Alert ER for emergency pericardiocentesis on arrival",
        ],
        contraindications=["Avoid aggressive fluid resuscitation"],
        urgency="IMMEDIATE",
        reference="NELS Cardiac Emergency Protocol, MoHFW India 2022",
        color_code="#D32F2F",
    ),

    NELSProtocol.TRAUMATIC_BRAIN_INJURY: ClinicalSupportCard(
        protocol=NELSProtocol.TRAUMATIC_BRAIN_INJURY,
        display_title="NELS Protocol Alert: Traumatic Brain Injury (GCS < 13)",
        recommended_actions=[
            "Maintain SBP > 110 mmHg — hypotension doubles TBI mortality",
            "Elevate head of bed 30° if no suspected spinal injury",
            "Avoid hypoxia — target SpO2 > 94%",
            "Administer 3% Hypertonic Saline 150mL if signs of herniation (blown pupil)",
            "Urgent CT head on arrival",
            "Do NOT hyperventilate (lowers CO2, causes vasoconstriction)",
        ],
        contraindications=["Avoid hypotonic fluids", "Avoid hypocapnia"],
        urgency="URGENT",
        reference="NELS TBI Protocol, MoHFW India 2022",
        color_code="#F57C00",
    ),

    NELSProtocol.BURNS: ClinicalSupportCard(
        protocol=NELSProtocol.BURNS,
        display_title="NELS Protocol Alert: Significant Burns",
        recommended_actions=[
            "Cool the burn with running water (20 min, not ice)",
            "Fluid resuscitation: Parkland Formula — 4mL × weight(kg) × %TBSA over 24h",
            "Remove jewelry and non-adherent clothing",
            "Maintain airway — intubate early if facial burns or stridor",
            "Pain management: IV morphine titrated",
        ],
        contraindications=["Do not apply ice — worsens tissue damage"],
        urgency="URGENT",
        reference="NELS Burns Protocol, MoHFW India 2022",
        color_code="#F57C00",
    ),
}


# ── Keyword maps for rule matching ────────────────────────────────────────────
_BLEEDING_KEYWORDS = frozenset([
    "bleed", "hemorrhage", "haemorrhage", "blood", "fracture", "amputation",
    "laceration", "crush", "mangled", "evisceration",
])
_CHEST_KEYWORDS = frozenset([
    "chest", "pneumothorax", "rib fracture", "rib", "hemothorax", "haemothorax",
    "flail chest", "stab", "impaled",
])
_TAMPONADE_KEYWORDS = frozenset([
    "tamponade", "pericardial", "muffled heart", "distended neck veins",
    "penetrating chest", "stabbed chest",
])
_HEAD_KEYWORDS = frozenset([
    "head", "skull", "brain", "concussion", "tbi", "intracranial",
    "altered consciousness", "confusion",
])
_BURN_KEYWORDS = frozenset([
    "burn", "scald", "flame", "chemical burn", "electrical burn", "inhalation",
])


def evaluate_nels_protocol(
    injuries: list[str],
    systolic_bp: Optional[int] = None,
    heart_rate: Optional[int] = None,
    gcs: Optional[int] = None,
    spo2: Optional[int] = None,
) -> Optional[ClinicalSupportCard]:
    """Deterministic NELS protocol evaluation.

    ZERO LLM involvement. Pure rule-based clinical decision support.
    Evaluates in priority order: IMMEDIATE protocols first.

    Args:
        injuries:    List of injury strings extracted by MIST entity extractor.
        systolic_bp: Systolic blood pressure (mmHg), or None if unknown.
        heart_rate:  Heart rate (bpm), or None if unknown.
        gcs:         Glasgow Coma Scale (3–15), or None if unknown.
        spo2:        Blood oxygen saturation (%), or None if unknown.

    Returns:
        ClinicalSupportCard for the highest-priority matching protocol,
        or None if no protocol matches.
    """
    injury_text = " ".join(injuries).lower()

    def _has(keywords: frozenset) -> bool:
        return any(kw in injury_text for kw in keywords)

    # ── Priority 1: Cardiac Tamponade ──────────────────────────────────────
    if _has(_TAMPONADE_KEYWORDS):
        return NELS_RULES[NELSProtocol.CARDIAC_TAMPONADE]

    # ── Priority 2: Hemorrhagic Shock ──────────────────────────────────────
    if _has(_BLEEDING_KEYWORDS) and systolic_bp is not None and systolic_bp < 90:
        return NELS_RULES[NELSProtocol.HEMORRHAGIC_SHOCK]

    # ── Priority 3: Tension Pneumothorax ──────────────────────────────────
    if _has(_CHEST_KEYWORDS) and spo2 is not None and spo2 < 90:
        return NELS_RULES[NELSProtocol.TENSION_PNEUMOTHORAX]

    # ── Priority 4: Traumatic Brain Injury ────────────────────────────────
    if _has(_HEAD_KEYWORDS) and gcs is not None and gcs < 13:
        return NELS_RULES[NELSProtocol.TRAUMATIC_BRAIN_INJURY]

    # ── Priority 5: Burns ─────────────────────────────────────────────────
    if _has(_BURN_KEYWORDS):
        return NELS_RULES[NELSProtocol.BURNS]

    return None
