"""
TraumaBridge AI — FastAPI Application Factory

SIH 2026 — Problem Statement: Open Innovation (MedTech/HealthTech)
"TraumaBridge AI: Pre-Hospital Emergency Telemetry Engine"

Architecture:
  Nginx → Gunicorn/UvicornWorker cluster → FastAPI
  Redis Pub/Sub for cross-worker WebSocket fan-out
  PostgreSQL (async) for persistent audit trail
  MQTT for low-bandwidth telemetry transport (store-and-forward)
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.redis_client import get_redis_pool, close_redis_pool
from app.db.session import init_db_pool, close_db_pool
from app.api.v1.router import api_router
from app.websockets.telemetry_stream import router as telemetry_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and graceful shutdown."""
    # ── Startup ───────────────────────────────────────────────────────────────
    app.state.redis = await get_redis_pool()
    try:
        app.state.db_pool = await init_db_pool()
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(
            "DB connectivity check failed at startup (will retry on first request): %s", e
        )
        app.state.db_pool = None

    yield

    # ── Shutdown ──────────────────────────────────────────────────────────────
    await close_redis_pool(app.state.redis)
    if app.state.db_pool:
        await close_db_pool(app.state.db_pool)


app = FastAPI(
    title="TraumaBridge AI — Emergency Telemetry Engine",
    description=(
        "Pre-hospital emergency telemetry system for Indian ambulances. "
        "MIST voice extraction → deterministic clinical scoring (RTS/SI/CPSS/NELS) → "
        "real-time ER dashboard alerts. "
        "Anti-fraud: cryptographic asystole timestamping (IEEE 11073 + SHA-256) "
        "prevents 'brought dead' hospital extortion."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.environment != "production" else None,
    redoc_url="/api/redoc" if settings.environment != "production" else None,
)

# CORS — allow PWA client and ER wallboard dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST API v1
app.include_router(api_router, prefix="/api/v1")

# WebSocket telemetry stream
app.include_router(telemetry_router, prefix="/api/v1/telemetry", tags=["WebSocket Telemetry"])
