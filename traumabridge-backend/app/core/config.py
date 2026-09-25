"""
TraumaBridge AI — Core Configuration
Pydantic Settings reads from .env file and environment variables.
All secrets are loaded from the environment; never hard-coded.
"""
from functools import lru_cache
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────────────────
    environment: Literal["development", "production", "test"] = "development"
    secret_key: str = "INSECURE-CHANGE-IN-PRODUCTION-256-bit-random-key"
    jwt_algorithm: str = "HS256"
    jwt_expiry_minutes: int = 480  # 8 hours — one ambulance shift

    # ── Database (PostgreSQL async) ───────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://tba_user:password@localhost:5432/traumabridge"
    db_pool_size: int = 20
    db_max_overflow: int = 10

    # ── Redis ────────────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    redis_max_connections: int = 100

    # ── MQTT Broker ───────────────────────────────────────────────────────────
    mqtt_broker_host: str = "localhost"
    mqtt_broker_port: int = 1883
    mqtt_username: str = ""
    mqtt_password: str = ""

    # ── Groq LPU (LLM entity extraction — NOT clinical decisions) ────────────
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    groq_fallback_model: str = "llama-3.1-8b-instant"
    groq_timeout_seconds: float = 5.0

    # ── Blood Bank Webhook ────────────────────────────────────────────────────
    blood_bank_webhook_url: str = ""
    blood_bank_api_key: str = ""

    # ── Telematics / GPS ──────────────────────────────────────────────────────
    telematics_api_url: str = ""
    telematics_api_key: str = ""

    # ── ABDM (Ayushman Bharat Digital Mission) ────────────────────────────────
    abdm_client_id: str = ""
    abdm_client_secret: str = ""
    abdm_base_url: str = "https://dev.abdm.gov.in/gateway"
    abdm_mock: bool = True  # True = skip live ABDM calls (hackathon mode)

    # ── CORS ──────────────────────────────────────────────────────────────────
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    # ── Anti-Fraud ────────────────────────────────────────────────────────────
    # Minimum ECG flatline duration (ms) before asystole is confirmed
    asystole_min_duration_ms: int = 3000

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_origins(cls, v):
        if isinstance(v, str):
            return [o.strip() for o in v.split(",")]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
