from sqlalchemy.orm import Session

from app.features.auth import crud
from app.features.auth.firebase import verify_firebase_id_token
from app.features.auth.schema import (
    AuthSessionResponse,
    AuthUserRead,
    FirebaseLoginRequest,
    SocialLoginMockRequest,
    SocialLoginMockResponse
)


def mock_social_login(payload: SocialLoginMockRequest) -> SocialLoginMockResponse:
    return SocialLoginMockResponse(
        access_token=f"mock-{payload.provider}-{payload.role}-{payload.provider_user_id}",
        role=payload.role
    )


def login_with_firebase(db: Session, payload: FirebaseLoginRequest) -> AuthSessionResponse:
    decoded_token = verify_firebase_id_token(payload.id_token)
    provider_user_id = decoded_token["uid"]
    email = decoded_token.get("email")
    display_name = decoded_token.get("name") or email or "GymIn 사용자"

    social_account = crud.get_social_account(
        db,
        provider="google",
        provider_user_id=provider_user_id,
        role=payload.role
    )
    if social_account is None:
        user, is_new_user = crud.create_user_with_social_account(
            db,
            display_name=display_name,
            email=email,
            provider="google",
            provider_user_id=provider_user_id,
            role=payload.role
        )
    else:
        user, is_new_user = crud.touch_social_login(db, social_account, email)

    return AuthSessionResponse(
        user=AuthUserRead(
            id=user.id,
            role=payload.role,
            display_name=user.display_name,
            email=user.email
        ),
        is_new_user=is_new_user
    )
