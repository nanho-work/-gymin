from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.auth.firebase import FirebaseAuthError
from app.features.auth.schema import (
    FirebaseLoginRequest,
    FirebaseLoginResponse,
    SocialLoginMockRequest,
    SocialLoginMockResponse
)
from app.features.auth.service import login_with_firebase, mock_social_login


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/social/mock", response_model=SocialLoginMockResponse)
def social_login_mock(payload: SocialLoginMockRequest) -> SocialLoginMockResponse:
    return mock_social_login(payload)


@router.post("/firebase/login", response_model=FirebaseLoginResponse)
def firebase_login(
    payload: FirebaseLoginRequest,
    db: Session = Depends(get_db)
) -> FirebaseLoginResponse:
    try:
        return login_with_firebase(db, payload)
    except FirebaseAuthError as exc:
        raise HTTPException(status_code=401, detail="Invalid Firebase token") from exc
