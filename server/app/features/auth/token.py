import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from app.core.config import get_settings


class AuthTokenError(Exception):
    pass


def _get_jwt_secret_key() -> str:
    settings = get_settings()
    if not settings.jwt_secret_key:
        raise AuthTokenError("JWT_SECRET_KEY is not configured")
    return settings.jwt_secret_key


def create_access_token(*, user_id: uuid.UUID, role: str) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(seconds=settings.auth_cookie_max_age_seconds)
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp())
    }
    return jwt.encode(payload, _get_jwt_secret_key(), algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        return jwt.decode(token, _get_jwt_secret_key(), algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError as exc:
        raise AuthTokenError("Invalid access token") from exc
