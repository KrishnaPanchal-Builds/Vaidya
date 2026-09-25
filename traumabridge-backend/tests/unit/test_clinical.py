"""
TraumaBridge AI — Clinical Module Unit Tests

All clinical scoring functions are deterministic and fully testable offline.
No mocks needed — these tests verify mathematical correctness against the
published formulas (Champion 1989, Olaussen 2014, Kothari 1999).
"""
import pytest
from app.clinical.rts import compute_rts
from app.clinical.shock_index import compute_shock_index
from app.clinical.cpss import compute_cpss
from app.clinical.nels_engine import evaluate_nels_protocol, NELSProtocol


# ── RTS Tests ─────────────────────────────────────────────────────────────────

class TestRevisedTraumaScore:
    def test_max_rts_normal_patient(self):
        """Healthy patient: GCS=15, SBP=120, RR=16 → T-RTS=12, RTS=7.8408"""
        result = compute_rts(gcs=15, sbp=120, rr=16)
        assert result.gcs_code == 4
        assert result.sbp_code == 4
        assert result.rr_code == 4
        assert result.t_rts == 12
        assert abs(result.rts - 7.8408) < 0.001
        assert result.is_major_trauma is False

    def test_major_trauma_low_rts(self):
        """Critical patient: GCS=6, SBP=60, RR=8 → major trauma"""
        result = compute_rts(gcs=6, sbp=60, rr=8)
        assert result.gcs_code == 2
        assert result.sbp_code == 2
        assert result.rr_code == 2
        assert result.t_rts == 6
        assert result.is_major_trauma is True

    def test_zero_rts_cardiac_arrest(self):
        """Cardiac arrest: GCS=3, SBP=0, RR=0 → RTS=0"""
        result = compute_rts(gcs=3, sbp=0, rr=0)
        assert result.t_rts == 0
        assert result.rts == 0.0
        assert result.is_major_trauma is True

    def test_gcs_boundary_9(self):
        assert compute_rts(gcs=9, sbp=120, rr=16).gcs_code == 3

    def test_sbp_boundary_76(self):
        assert compute_rts(gcs=15, sbp=76, rr=16).sbp_code == 3

    def test_rr_fast_above_29(self):
        assert compute_rts(gcs=15, sbp=120, rr=30).rr_code == 3


# ── Shock Index Tests ──────────────────────────────────────────────────────────

class TestShockIndex:
    def test_normal_si(self):
        """HR=70, SBP=120 → SI=0.58 (NORMAL)"""
        result = compute_shock_index(heart_rate=70, systolic_bp=120)
        assert abs(result.value - 0.58) < 0.01
        assert result.is_critical is False
        assert result.urgency_level == "NORMAL"

    def test_critical_si_high(self):
        """HR=110, SBP=90 → SI=1.22 (HIGH — prepare 2 units O-Neg)"""
        result = compute_shock_index(heart_rate=110, systolic_bp=90)
        assert result.is_critical is True
        assert result.urgency_level == "HIGH"
        assert result.transfusion_risk_multiplier == 4.0

    def test_critical_si_extreme(self):
        """HR=140, SBP=80 → SI=1.75 (CRITICAL — MTP activation)"""
        result = compute_shock_index(heart_rate=140, systolic_bp=80)
        assert result.is_critical is True
        assert result.urgency_level == "CRITICAL"
        assert result.transfusion_risk_multiplier == 7.0

    def test_sbp_zero_raises(self):
        with pytest.raises(ValueError, match="Systolic BP must be > 0"):
            compute_shock_index(heart_rate=80, systolic_bp=0)


# ── CPSS Tests ─────────────────────────────────────────────────────────────────

class TestCPSS:
    def test_no_markers(self):
        result = compute_cpss(facial_droop=False, arm_drift=False, speech_abnormal=False)
        assert result.total_score == 0
        assert result.stroke_probability == 0.0
        assert result.is_positive is False

    def test_single_marker(self):
        result = compute_cpss(facial_droop=True, arm_drift=False, speech_abnormal=False)
        assert result.total_score == 1
        assert result.stroke_probability == 0.72
        assert result.is_positive is True

    def test_all_markers(self):
        result = compute_cpss(facial_droop=True, arm_drift=True, speech_abnormal=True)
        assert result.total_score == 3
        assert result.stroke_probability == 0.85
        assert result.is_positive is True
        assert "CODE STROKE" in result.interpretation


# ── NELS Rule Engine Tests ─────────────────────────────────────────────────────

class TestNELSEngine:
    def test_hemorrhagic_shock_trigger(self):
        """Crush injury + hypotension → HEMORRHAGIC_SHOCK"""
        card = evaluate_nels_protocol(
            injuries=["crush injury left leg", "open fracture femur"],
            systolic_bp=80,
            heart_rate=120,
        )
        assert card is not None
        assert card.protocol == NELSProtocol.HEMORRHAGIC_SHOCK
        assert card.urgency == "IMMEDIATE"

    def test_tension_pneumothorax_trigger(self):
        """Chest injury + low SpO2 → TENSION_PNEUMOTHORAX"""
        card = evaluate_nels_protocol(
            injuries=["rib fracture right side", "chest contusion"],
            spo2=85,
        )
        assert card is not None
        assert card.protocol == NELSProtocol.TENSION_PNEUMOTHORAX

    def test_tbi_trigger(self):
        """Head injury + low GCS → TRAUMATIC_BRAIN_INJURY"""
        card = evaluate_nels_protocol(
            injuries=["head trauma", "skull fracture"],
            gcs=8,
        )
        assert card is not None
        assert card.protocol == NELSProtocol.TRAUMATIC_BRAIN_INJURY
        assert card.urgency == "URGENT"

    def test_burns_trigger(self):
        card = evaluate_nels_protocol(injuries=["flame burn 30% TBSA"])
        assert card is not None
        assert card.protocol == NELSProtocol.BURNS

    def test_no_protocol_minor_injuries(self):
        """Minor injuries, normal vitals → no NELS protocol"""
        card = evaluate_nels_protocol(
            injuries=["minor laceration finger"],
            systolic_bp=120,
            heart_rate=80,
            gcs=15,
            spo2=98,
        )
        assert card is None

    def test_tamponade_priority_over_hemorrhage(self):
        """Tamponade should fire before hemorrhagic shock (higher priority)."""
        card = evaluate_nels_protocol(
            injuries=["penetrating chest stab tamponade suspected", "bleeding laceration"],
            systolic_bp=70,
        )
        assert card is not None
        assert card.protocol == NELSProtocol.CARDIAC_TAMPONADE
