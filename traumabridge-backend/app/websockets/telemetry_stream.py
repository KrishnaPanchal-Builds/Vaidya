"""
TraumaBridge AI — WebSocket Telemetry Stream

Full-duplex WebSocket endpoint for:
  - EMT tablets (transit_id) → publish vitals
  - ER Wallboards (hospital_id) → receive alerts

Cross-worker fan-out via Redis Pub/Sub.
"""
from __future__ import annotations

import asyncio
import json
import logging
import time

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

from app.core.redis_client import get_redis_pool
from app.core.security import verify_ws_token

logger = logging.getLogger(__name__)
router = APIRouter()


class ConnectionManager:
    """Manages active WebSocket connections by transit and hospital."""

    def __init__(self):
        self.transit_connections: dict[str, set[WebSocket]] = {}
        self.wallboard_connections: dict[str, set[WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def connect_transit(self, ws: WebSocket, transit_id: str) -> None:
        await ws.accept()
        async with self._lock:
            self.transit_connections.setdefault(transit_id, set()).add(ws)
        logger.info("EMT connected: transit=%s total=%d", transit_id,
                    len(self.transit_connections[transit_id]))

    async def connect_wallboard(self, ws: WebSocket, hospital_id: str) -> None:
        await ws.accept()
        async with self._lock:
            self.wallboard_connections.setdefault(hospital_id, set()).add(ws)
        logger.info("Wallboard connected: hospital=%s total=%d", hospital_id,
                    len(self.wallboard_connections[hospital_id]))

    async def disconnect(
        self,
        ws: WebSocket,
        transit_id: str | None = None,
        hospital_id: str | None = None,
    ) -> None:
        async with self._lock:
            if transit_id and transit_id in self.transit_connections:
                self.transit_connections[transit_id].discard(ws)
                if not self.transit_connections[transit_id]:
                    del self.transit_connections[transit_id]
            if hospital_id and hospital_id in self.wallboard_connections:
                self.wallboard_connections[hospital_id].discard(ws)
                if not self.wallboard_connections[hospital_id]:
                    del self.wallboard_connections[hospital_id]

    async def broadcast_to_hospital(self, hospital_id: str, message: dict) -> None:
        connections = self.wallboard_connections.get(hospital_id, set())
        if connections:
            payload = json.dumps(message, default=str)
            await asyncio.gather(
                *(ws.send_text(payload) for ws in connections),
                return_exceptions=True,
            )


manager = ConnectionManager()


@router.websocket("/stream")
async def telemetry_stream(
    websocket: WebSocket,
    token: str = Query(..., description="JWT bearer token"),
    transit_id: str = Query(None, description="EMT tablet connects with transit ID"),
    hospital_id: str = Query(None, description="ER wallboard connects with hospital ID"),
):
    """Persistent bidirectional WebSocket for telemetry streaming.

    EMT clients connect with `transit_id` — they publish vitals and receive
    Clinical Support Card notifications.

    Wallboard clients connect with `hospital_id` — they receive all incoming
    alerts and critical notifications for their ED.
    """
    claims = await verify_ws_token(token)
    if not claims:
        await websocket.close(code=4001, reason="Unauthorized")
        return

    if not transit_id and not hospital_id:
        await websocket.close(code=4002, reason="Missing transit_id or hospital_id")
        return

    if transit_id:
        await manager.connect_transit(websocket, transit_id)
        channel = f"tba:telemetry:{transit_id}"
    else:
        await manager.connect_wallboard(websocket, hospital_id)
        channel = f"tba:critical:{hospital_id}"

    redis = await get_redis_pool()
    pubsub = redis.pubsub()
    await pubsub.subscribe(channel)

    try:
        async def _redis_to_ws():
            """Forward Redis Pub/Sub messages to WebSocket client."""
            async for message in pubsub.listen():
                if message["type"] == "message":
                    await websocket.send_bytes(message["data"])

        async def _ws_to_redis():
            """Handle incoming WebSocket messages (heartbeat, MIST submission)."""
            while True:
                data = await websocket.receive_text()
                try:
                    msg = json.loads(data)
                    msg_type = msg.get("type", "")

                    if msg_type == "HEARTBEAT":
                        await websocket.send_json({
                            "type": "HEARTBEAT_ACK",
                            "ts": time.time(),
                        })
                    elif msg_type == "VITALS_UPDATE" and transit_id:
                        # Publish to Redis so all workers and wallboards receive it
                        from app.services.telemetry_publisher import publish_telemetry
                        await publish_telemetry(transit_id, msg)
                    # Other message types handled by REST API endpoints

                except json.JSONDecodeError:
                    logger.warning("Received non-JSON WebSocket message, ignoring")

        await asyncio.gather(_redis_to_ws(), _ws_to_redis())

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected: transit=%s hospital=%s", transit_id, hospital_id)
    finally:
        await manager.disconnect(websocket, transit_id, hospital_id)
        await pubsub.unsubscribe(channel)
        await pubsub.aclose()
