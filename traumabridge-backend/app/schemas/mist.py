"""
TraumaBridge AI — Pydantic Schemas for MIST Protocol

MIST = Mechanism, Injuries, Signs, Treatment
These schemas validate LLM extraction output before any clinical logic runs.
"""
from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class MISTSigns(BaseModel):
    gcs: Optional[int] = Field(None, ge=3, le=15, description="Glasgow Coma Scale")
    systolic_bp: Optional[int] = Field(None, ge=0, le=300, description="Systolic BP (mmHg)")
    diastolic_bp: Optional[int] = Field(None, ge=0, le=200, description="Diastolic BP (mmHg)")
    heart_rate: Optional[int] = Field(None, ge=0, le=300, description="Heart rate (bpm)")
    respiratory_rate: Optional[int] = Field(None, ge=0, le=60, description="Resp. rate (/min)")
    spo2: Optional[int] = Field(None, ge=0, le=100, description="SpO2 (%)")
    temperature: Optional[float] = Field(None, ge=25.0, le=45.0, description="Temp (°C)")
    pain_score: Optional[int] = Field(None, ge=0, le=10, description="NRS pain score")


class MISTExtractionResult(BaseModel):
    """Validated output from the Groq LLM entity extractor."""
    mechanism: Optional[str] = None
    injuries: list[str] = Field(default_factory=list)
    signs: MISTSigns = Field(default_factory=MISTSigns)
    treatment: list[str] = Field(default_factory=list)
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)

    @field_validator("injuries", "treatment")
    @classmethod
    def _cap_array(cls, v: list[str]) -> list[str]:
        """Prevent LLM from returning absurdly long lists."""
        return v[:20] if len(v) > 20 else v


class MISTExtractionError(Exception):
    """Raised when MIST extraction fails (bad JSON, timeout, etc.)."""
    pass
