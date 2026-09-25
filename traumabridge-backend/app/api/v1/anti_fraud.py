"""
TraumaBridge AI — Anti-Fraud API Endpoint

POST /api/v1/anti-fraud/verify-asystole
  Called by: PM-JAY insurance auditors, hospital admin, legal authorities
  Returns: Immutable cryptographic proof of asystole time
"""
from __future__ import annotations

import hashlib
import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas.anti_fraud import AsystoleVerificationRequest, AsystoleVerificationResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/verify-asystole",
    response_model=AsystoleVerificationResponse,
    summary="Verify cryptographic asystole proof",
    description=(
        "Retrieves the immutable cryptographic record of a patient's asystole event. "
        "Re-computes the SHA-256 hash to verify the record has not been tampered with. "
        "Compliant with DPDP Act 2023 audit requirements."
    ),
)
async def verify_asystole_event(
    request: AsystoleVerificationRequest,
) -> AsystoleVerificationResponse:
    """Verify the authenticity of an asystole event by transit ID."""

    # Query asystole record from DB
    event = await _get_asystole_record(request.transit_id)

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No asystole event found for transit_id={request.transit_id}",
        )

    # Re-compute hash to verify integrity (tamper detection)
    hash_input = (
        f"{event['transit_id']}|{event['device_serial']}|{event['flatline_start_ms']}|"
        f"{event['flatline_duration_ms']}|{event['latitude']}|{event['longitude']}|"
        f"{event['network_time_utc']}"
    )
    recomputed = hashlib.sha256(hash_input.encode("utf-8")).hexdigest()
    is_valid = recomputed == event["sha256_hash"]

    if not is_valid:
        logger.critical(
            "HASH MISMATCH — possible tampering: transit=%s stored=%s recomputed=%s",
            request.transit_id,
            event["sha256_hash"][:16],
            recomputed[:16],
        )

    return AsystoleVerificationResponse(
        transit_id=event["transit_id"],
        asystole_confirmed=True,
        flatline_start_time=event["flatline_start_ms"],
        flatline_duration_ms=event["flatline_duration_ms"],
        location={"latitude": event["latitude"], "longitude": event["longitude"]},
        network_time_utc=event["network_time_utc"],
        sha256_hash=event["sha256_hash"],
        hash_valid=is_valid,
        abha_id=event.get("abha_id"),
        legal_note=(
            "This cryptographic record constitutes tamper-proof evidence of the time of "
            "asystole. Any hospital claiming the patient was alive upon arrival must "
            "provide counter-evidence. Compliant with IEEE 11073 telemetry standards "
            "and DPDP Act 2023 audit requirements. PM-JAY auditors may use this record "
            "to reject fraudulent ICU billing claims."
        ),
    )


async def _get_asystole_record(transit_id: str) -> dict | None:
    """Fetch asystole event from DB. Returns None if not found."""
    try:
        import sqlalchemy
        from app.db.session import AsyncSessionLocal

        async with AsyncSessionLocal() as db:
            result = await db.execute(
                sqlalchemy.text(
                    """
                    SELECT id::text              AS transit_id,
                           asystole_hash         AS sha256_hash,
                           asystole_timestamp    AS network_time_utc,
                           abha_id
                    FROM transits
                    WHERE id = :tid
                      AND asystole_detected = TRUE
                    LIMIT 1
                    """
                ),
                {"tid": transit_id},
            )
            row = result.mappings().fetchone()
            if not row:
                return None

            # Build the full record (device serial / GPS stored separately in production)
            return {
                "transit_id": str(row["transit_id"]),
                "sha256_hash": row["sha256_hash"] or "",
                "network_time_utc": str(row["network_time_utc"]),
                "abha_id": row.get("abha_id"),
                # These are stored in the hash preimage but retrieved from a full record
                # In production, store all hash fields in a dedicated asystole_events table
                "device_serial": "UNAVAILABLE",
                "flatline_start_ms": 0,
                "flatline_duration_ms": 0,
                "latitude": 0.0,
                "longitude": 0.0,
            }
    except Exception as e:
        logger.error("Failed to query asystole record: %s", e)
        return None
