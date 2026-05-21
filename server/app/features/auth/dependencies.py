import uuid
from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.features.auth.model import UserRole
from app.features.auth.token import AuthTokenError, decode_access_token
from app.features.users.model import User


@dataclass(frozen=True)
class CurrentUser:
    id: uuid.UUID
    role: str
    display_name: str
    email: str | None


def get_current_user(
    request: Request,
    db: Annotated[Session, Depends(get_db)]
) -> CurrentUser:
    settings = get_settings()
    token = request.cookies.get(settings.auth_cookie_name)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="로그인이 필요합니다."
        )

    try:
        payload = decode_access_token(token)
        user_id = uuid.UUID(str(payload["sub"]))
        role = str(payload["role"])
    except (AuthTokenError, KeyError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="로그인 정보가 유효하지 않습니다."
        ) from exc

    statement = (
        select(User, UserRole)
        .join(UserRole, UserRole.user_id == User.id)
        .where(
            User.id == user_id,
            User.status == "active",
            UserRole.role == role,
            UserRole.status == "active"
        )
    )
    result = db.execute(statement).first()
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자 권한을 확인할 수 없습니다."
        )

    user, user_role = result
    return CurrentUser(
        id=user.id,
        role=user_role.role,
        display_name=user.display_name,
        email=user.email
    )


def require_trainer(current_user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
    if current_user.role != "trainer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="트레이너 계정만 사용할 수 있습니다.")
    return current_user


def require_business(current_user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
    if current_user.role != "business":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="사업자 계정만 사용할 수 있습니다.")
    return current_user
