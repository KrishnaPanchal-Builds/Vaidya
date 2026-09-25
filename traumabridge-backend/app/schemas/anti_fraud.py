"""
TraumaBridge AI — Anti-Fraud Schemas (Asystole Verification)
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class AsystoleVerificationRequest(BaseModel):
    transit_id: str


class AsystoleVerificationResponse(BaseModel):
    transit_id: str
    asystole_confirmed: bool
    flatline_start_time: int            # Unix epoch ms
    flatline_duration_ms: int
    location: dict[str, float]          # {"latitude": ..., "longitude": ...}
    network_time_utc: str
    sha256_hash: str
    hash_valid: bool
    abha_id: Optional[str] = None
    legal_note: str
