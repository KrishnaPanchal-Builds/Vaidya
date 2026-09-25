"""
TraumaBridge AI — Health Check Endpoints

GET /api/v1/health/live   → Liveness (always 200 if process is running)
GET /api/v1/health/ready  → Readiness (200 if Redis + DB are connected)
"""
from __future__ import annotations

import logging

from fastapi import APIRouter
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()


class HealthStatus(BaseModel):
    status: str
    service: str = "traumabridge-backend"
    version: str = "1.0.0"
    details: dict = {}


@router.get("/live", response_model=HealthStatus, summary="Liveness probe")
async def liveness() -> HealthStatus:
    return HealthStatus(status="ok")


@router.get("/ready", response_model=HealthStatus, summary="Readiness probe")
async def readiness() -> HealthStatus:
    details = {}

    # Check Redis
    try:
        from app.core.redis_client import get_redis_pool
        redis = await get_redis_pool()
        await redis.ping()
        details["redis"] = "ok"
    except Exception as e:
        details["redis"] = f"error: {e}"

    # Check DB
    try:
        import sqlalchemy
        from app.db.session import AsyncSessionLocal
        async with AsyncSessionLocal() as db:
            await db.execute(sqlalchemy.text("SELECT 1"))
        details["database"] = "ok"
    except Exception as e:
        details["database"] = f"error: {e}"

    all_ok = all(v == "ok" for v in details.values())
    return HealthStatus(
        status="ok" if all_ok else "degraded",
        details=details,
    )
