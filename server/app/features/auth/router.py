from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, get_current_user
from app.features.auth.firebase import FirebaseAuthError
from app.features.auth.schema import (
    AuthSessionResponse,
    AuthUserRead,
    FirebaseLoginRequest,
    SocialLoginMockRequest,
    SocialLoginMockResponse
)
from app.features.auth.service import login_with_firebase, mock_social_login
from app.features.auth.token import AuthTokenError, create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/social/mock", response_model=SocialLoginMockResponse)
def social_login_mock(payload: SocialLoginMockRequest) -> SocialLoginMockResponse:
    return mock_social_login(payload)


@router.post("/firebase/login", response_model=AuthSessionResponse)
def firebase_login(
    payload: FirebaseLoginRequest,
    response: Response,
    db: Session = Depends(get_db)
) -> AuthSessionResponse:
    try:
        session = login_with_firebase(db, payload)
        access_token = create_access_token(user_id=session.user.id, role=session.user.role)
        settings = get_settings()
        response.set_cookie(
            key=settings.auth_cookie_name,
            value=access_token,
            max_age=settings.auth_cookie_max_age_seconds,
            httponly=True,
            secure=settings.should_use_secure_auth_cookie,
            samesite="lax",
            path="/"
        )
        return session
    except FirebaseAuthError as exc:
        raise HTTPException(status_code=401, detail="Invalid Firebase token") from exc
    except AuthTokenError as exc:
        raise HTTPException(status_code=500, detail="JWT 설정이 필요합니다.") from exc


@router.get("/me", response_model=AuthSessionResponse)
def read_current_session(
    current_user: Annotated[CurrentUser, Depends(get_current_user)]
) -> AuthSessionResponse:
    return AuthSessionResponse(
        user=AuthUserRead(
            id=current_user.id,
            role=current_user.role,
            display_name=current_user.display_name,
            email=current_user.email
        )
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> Response:
    settings = get_settings()
    response.delete_cookie(
        key=settings.auth_cookie_name,
        path="/",
        httponly=True,
        secure=settings.should_use_secure_auth_cookie,
        samesite="lax"
    )
    return response
