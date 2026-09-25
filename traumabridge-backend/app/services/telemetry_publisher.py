"""
TraumaBridge AI — Redis Pub/Sub Telemetry Publisher

Channel naming convention (see blueprint §1.1.2):
  tba:telemetry:{transit_id}   → real-time vitals stream
  tba:alerts:{hospital_id}     → all incoming alerts for an ED wallboard
  tba:critical:{hospital_id}   → critical alerts (full-screen flash)
  tba:session:{session_id}     → ephemeral session state (15-min TTL)
"""
from __future__ import annotations

import json
import logging

from app.core.redis_client import get_redis_pool

logger = logging.getLogger(__name__)


async def publish_telemetry(transit_id: str, payload: dict) -> None:
    """Publish a telemetry update to the transit-specific channel."""
    redis = await get_redis_pool()
    channel = f"tba:telemetry:{transit_id}"
    await redis.publish(channel, json.dumps(payload, default=str))
    logger.debug("Published telemetry → %s", channel)


async def publish_hospital_alert(hospital_id: str, alert: dict) -> None:
    """Publish a standard alert to the hospital ED wallboard channel."""
    redis = await get_redis_pool()
    channel = f"tba:alerts:{hospital_id}"
    await redis.publish(channel, json.dumps(alert, default=str))
    logger.info("Published alert → %s (type=%s)", channel, alert.get("type", "?"))


async def publish_critical_alert(hospital_id: str, alert: dict) -> None:
    """Publish a critical alert requiring full-screen flash on the ED wallboard."""
    redis = await get_redis_pool()
    channel = f"tba:critical:{hospital_id}"
    await redis.publish(channel, json.dumps(alert, default=str))
    logger.warning("Published CRITICAL alert → %s (type=%s)", channel, alert.get("type", "?"))
