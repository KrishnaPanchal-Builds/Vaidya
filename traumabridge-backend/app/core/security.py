"""
TraumaBridge AI — JWT Security
Handles access token creation and verification for all API and WebSocket endpoints.
"""
import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from fastapi import HTTPException, status
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.jwt_expiry_minutes)
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any] | None:
    """Decode and validate a JWT token. Returns claims dict or None."""
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError as e:
        logger.warning("JWT validation failed: %s", e)
        return None


async def verify_ws_token(token: str) -> dict[str, Any] | None:
    """Verify a WebSocket bearer token (async wrapper for compatibility)."""
    return decode_access_token(token)


def require_role(claims: dict, *allowed_roles: str) -> None:
    """Raise HTTP 403 if the token role is not in allowed_roles."""
    role = claims.get("role", "")
    if role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role '{role}' is not authorized for this action",
        )
