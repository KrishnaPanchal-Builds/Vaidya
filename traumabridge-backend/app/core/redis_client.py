"""
TraumaBridge AI — Redis Connection Pool
Binary-safe pool (decode_responses=False) to support Protobuf byte payloads
as well as JSON strings on the same connection pool.
"""
import redis.asyncio as aioredis
from app.core.config import get_settings

settings = get_settings()

_redis_pool: aioredis.Redis | None = None


async def get_redis_pool() -> aioredis.Redis:
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=False,  # Binary-safe for Protobuf payloads
            max_connections=settings.redis_max_connections,
            socket_timeout=5,
            socket_connect_timeout=5,
            retry_on_timeout=True,
        )
    return _redis_pool


async def close_redis_pool(pool: aioredis.Redis) -> None:
    await pool.aclose()
