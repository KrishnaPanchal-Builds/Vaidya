"""
TraumaBridge AI — Revised Trauma Score (RTS)

Reference: Champion HR, Sacco WJ, Copes WS, et al.
"A revision of the Trauma Score." J Trauma. 1989;29(5):623-629.

Formula: RTS = 0.9368(GCS_c) + 0.7326(SBP_c) + 0.2908(RR_c)
Range: 0.0 – 7.8408  |  RTS < 11 (unweighted T-RTS < 11) → major trauma
"""
from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class RTSResult:
    rts: float               # Weighted RTS (0.0 – 7.8408)
    t_rts: int               # Unweighted T-RTS (0 – 12)
    gcs_code: int
    sbp_code: int
    rr_code: int
    is_major_trauma: bool
    interpretation: str


def _code_gcs(gcs: int) -> int:
    """Map GCS (3–15) to coded value (0–4)."""
    if gcs >= 13:  return 4
    elif gcs >= 9: return 3
    elif gcs >= 6: return 2
    elif gcs >= 4: return 1
    else:          return 0


def _code_sbp(sbp: int) -> int:
    """Map Systolic BP (mmHg) to coded value (0–4)."""
    if sbp > 89:   return 4
    elif sbp >= 76: return 3
    elif sbp >= 50: return 2
    elif sbp >= 1:  return 1
    else:           return 0


def _code_rr(rr: int) -> int:
    """Map Respiratory Rate (/min) to coded value (0–4)."""
    if 10 <= rr <= 29: return 4
    elif rr > 29:      return 3
    elif rr >= 6:      return 2
    elif rr >= 1:      return 1
    else:              return 0


def compute_rts(gcs: int, sbp: int, rr: int) -> RTSResult:
    """Compute weighted and unweighted Revised Trauma Score.

    Args:
        gcs: Glasgow Coma Scale (3–15)
        sbp: Systolic Blood Pressure (mmHg)
        rr:  Respiratory Rate (/min)

    Returns:
        RTSResult dataclass with all scores and interpretation.
    """
    gc = _code_gcs(gcs)
    sc = _code_sbp(sbp)
    rc = _code_rr(rr)

    rts = round((0.9368 * gc) + (0.7326 * sc) + (0.2908 * rc), 4)
    t_rts = gc + sc + rc
    is_major = t_rts < 11

    if t_rts >= 11:
        interp = "Mild trauma — standard monitoring"
    elif t_rts >= 6:
        interp = "Moderate trauma — urgent assessment required"
    else:
        interp = "MAJOR TRAUMA — immediate trauma team activation"

    return RTSResult(
        rts=rts,
        t_rts=t_rts,
        gcs_code=gc,
        sbp_code=sc,
        rr_code=rc,
        is_major_trauma=is_major,
        interpretation=interp,
    )
