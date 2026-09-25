"""
TraumaBridge AI — Groq LPU MIST Entity Extractor

The LLM is a PURE TOKENIZER — it extracts structured fields from spoken MIST
reports. It makes ZERO clinical decisions. All medical reasoning happens in
app/clinical/*.py via deterministic rule engines.

Model: llama-3.3-70b-versatile (primary) / llama-3.1-8b-instant (fallback)
Latency target: < 500ms (Groq LPU hardware guarantee)
"""
from __future__ import annotations

import json
import logging

from groq import AsyncGroq

from app.core.config import get_settings
from app.schemas.mist import MISTExtractionResult, MISTExtractionError

logger = logging.getLogger(__name__)
settings = get_settings()

groq_client = AsyncGroq(api_key=settings.groq_api_key)

# ── System prompt — strict JSON extraction, no clinical reasoning ──────────────
MIST_EXTRACTION_PROMPT = """\
You are a medical entity extraction engine for emergency trauma care.
Your ONLY function is to extract structured entities from the paramedic's spoken MIST report.
You MUST NOT diagnose, interpret, or add any clinical reasoning.
Output ONLY valid JSON matching the schema below. No prose, no explanations.

SCHEMA:
{
  "mechanism": "string or null (e.g., 'RTA high-speed collision', 'fall from height 3m')",
  "injuries": ["array of strings (e.g., 'chest puncture', 'open femur fracture')"],
  "signs": {
    "gcs": "integer 3-15 or null",
    "systolic_bp": "integer mmHg or null",
    "diastolic_bp": "integer mmHg or null",
    "heart_rate": "integer bpm or null",
    "respiratory_rate": "integer /min or null",
    "spo2": "integer % or null",
    "temperature": "float Celsius or null",
    "pain_score": "integer 0-10 or null"
  },
  "treatment": ["array of strings (e.g., 'IV access established', 'oxygen 15L NRB')"],
  "confidence": "float 0.0-1.0 (your extraction confidence)"
}

If a field is not mentioned, use null. DO NOT fabricate values.
"""


async def extract_mist_entities(transcript: str) -> MISTExtractionResult:
    """Extract structured MIST entities from a voice transcript.

    Uses Groq LPU for sub-500ms inference with strict JSON mode.

    Args:
        transcript: Raw speech-to-text output from paramedic's MIST report.

    Returns:
        Validated MISTExtractionResult.

    Raises:
        MISTExtractionError: on JSON parse failure or timeout.
    """
    if not transcript or not transcript.strip():
        # Return empty result for blank input — don't call LLM
        return MISTExtractionResult(confidence=0.0)

    try:
        response = await groq_client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": MIST_EXTRACTION_PROMPT},
                {"role": "user", "content": f"TRANSCRIPT: {transcript.strip()}"},
            ],
            temperature=0.0,   # Fully deterministic output
            max_tokens=1024,
            response_format={"type": "json_object"},
            timeout=settings.groq_timeout_seconds,
        )

        raw = response.choices[0].message.content
        parsed = json.loads(raw)

        # Pydantic validates and clamps all values
        result = MISTExtractionResult(**parsed)

        logger.info(
            "MIST extraction OK: transcript_len=%d, confidence=%.2f, injuries=%d",
            len(transcript),
            result.confidence,
            len(result.injuries),
        )
        return result

    except json.JSONDecodeError as e:
        logger.error("LLM returned invalid JSON: %s | raw=%r", e, raw[:200])
        raise MISTExtractionError(f"Invalid JSON from LLM: {e}") from e
    except Exception as e:
        logger.error("MIST extraction failed: %s", e, exc_info=True)
        raise MISTExtractionError(f"Extraction failed: {e}") from e
