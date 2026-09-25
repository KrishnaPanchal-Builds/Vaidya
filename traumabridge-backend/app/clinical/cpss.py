"""
TraumaBridge AI — Cincinnati Prehospital Stroke Scale (CPSS)

Reference: Kothari RU, Pancioli A, Liu T, Brott T, Broderick J.
"Cincinnati Prehospital Stroke Scale: reproducibility and validity."
Annals of Emergency Medicine. 1999;33(4):373-378.

3-item binary scale: facial droop + arm drift + speech impairment.
Any abnormality = high stroke probability.
"""
from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class CPSSResult:
    facial_droop: bool
    arm_drift: bool
    speech_abnormal: bool
    total_score: int        # 0–3
    stroke_probability: float   # 0.0–1.0
    is_positive: bool           # True = CODE STROKE consideration
    interpretation: str


def compute_cpss(
    facial_droop: bool,
    arm_drift: bool,
    speech_abnormal: bool,
) -> CPSSResult:
    """Compute Cincinnati Prehospital Stroke Scale.

    Probability mapping (Kothari 1999):
    - 0 markers → 0% stroke probability (normal)
    - 1 marker  → 72% stroke probability
    - 2+ markers → 85% stroke probability
    """
    total = int(facial_droop) + int(arm_drift) + int(speech_abnormal)

    if total == 0:
        prob = 0.0
        is_positive = False
        interp = "No stroke markers detected — continue standard assessment"
    elif total == 1:
        prob = 0.72
        is_positive = True
        interp = "Single stroke marker present — urgent neurology consult recommended"
    else:
        prob = 0.85
        is_positive = True
        interp = "Multiple stroke markers present — CODE STROKE activation required; priority CT scanning"

    return CPSSResult(
        facial_droop=facial_droop,
        arm_drift=arm_drift,
        speech_abnormal=speech_abnormal,
        total_score=total,
        stroke_probability=prob,
        is_positive=is_positive,
        interpretation=interp,
    )
