"""
TraumaBridge AI — Asystole Detector Unit Tests
"""
import pytest
from unittest.mock import AsyncMock, patch
from app.anti_fraud.asystole_detector import AsystoleDetector, verify_asystole_hash


class TestAsystoleDetector:
    def setup_method(self):
        self.detector = AsystoleDetector(min_flatline_duration_ms=3000)

    @pytest.mark.asyncio
    async def test_ieee_11073_event_triggers_immediately(self):
        """MDC_EVT_ECG_ASYSTOLE code should trigger immediately on first sample."""
        with (
            patch.object(self.detector, "_get_current_gps", return_value=(19.0, 72.8)),
            patch.object(self.detector, "_get_network_time", return_value="2026-09-25T10:00:00+00:00"),
            patch.object(self.detector, "_get_abha_for_transit", return_value="12345678901234"),
            patch.object(self.detector, "_persist_asystole_event", new_callable=AsyncMock),
            patch.object(self.detector, "_notify_hospital_er", new_callable=AsyncMock),
        ):
            event = await self.detector.process_ecg_sample(
                transit_id="TBA-20260925-0001",
                device_serial="ZOLL-12345",
                event_code="MDC_EVT_ECG_ASYSTOLE",
                sample_timestamp_ms=1_000_000,
                ecg_value=0.5,
            )

        assert event is not None
        assert event.transit_id == "TBA-20260925-0001"
        assert event.abha_id == "12345678901234"
        assert len(event.sha256_hash) == 64  # SHA-256 hex

    @pytest.mark.asyncio
    async def test_flatline_waveform_requires_3_seconds(self):
        """Waveform detection: must sustain flatline ≥ 3000ms before confirming."""
        # Sample at t=0 (flatline starts)
        result1 = await self.detector.process_ecg_sample(
            "TBA-test", "DEVICE-1", "NORMAL", 0, 0.0
        )
        assert result1 is None  # Not yet confirmed

        # Sample at t=1000ms (1 second — still below threshold)
        result2 = await self.detector.process_ecg_sample(
            "TBA-test", "DEVICE-1", "NORMAL", 1000, 0.0
        )
        assert result2 is None

    @pytest.mark.asyncio
    async def test_ecg_activity_resets_flatline_tracker(self):
        """Normal ECG should reset the flatline tracker."""
        # Start flatline
        await self.detector.process_ecg_sample("T1", "D1", "NORMAL", 0, 0.0)
        assert "T1" in self.detector._active_flatlines

        # Normal QRS spike clears tracker
        await self.detector.process_ecg_sample("T1", "D1", "NORMAL", 100, 1.2)
        assert "T1" not in self.detector._active_flatlines


class TestAsystoleHashVerification:
    def test_valid_hash_returns_true(self):
        import hashlib
        from dataclasses import dataclass

        @dataclass
        class FakeRecord:
            transit_id = "TBA-20260925-0001"
            device_serial = "ZOLL-12345"
            flatline_start_ms = 1_000_000
            flatline_duration_ms = 5000
            latitude = 19.0
            longitude = 72.8
            network_time_utc = "2026-09-25T10:00:00+00:00"
            sha256_hash = ""

        rec = FakeRecord()
        hash_input = (
            f"{rec.transit_id}|{rec.device_serial}|{rec.flatline_start_ms}|"
            f"{rec.flatline_duration_ms}|{rec.latitude}|{rec.longitude}|"
            f"{rec.network_time_utc}"
        )
        rec.sha256_hash = hashlib.sha256(hash_input.encode()).hexdigest()
        assert verify_asystole_hash(rec) is True

    def test_tampered_hash_returns_false(self):
        from dataclasses import dataclass

        @dataclass
        class TamperedRecord:
            transit_id = "TBA-20260925-0001"
            device_serial = "ZOLL-12345"
            flatline_start_ms = 1_000_000
            flatline_duration_ms = 5000
            latitude = 19.0
            longitude = 72.8
            network_time_utc = "2026-09-25T10:00:00+00:00"
            sha256_hash = "0" * 64  # Clearly wrong

        assert verify_asystole_hash(TamperedRecord()) is False
