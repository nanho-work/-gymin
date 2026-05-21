from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, get_current_user
from app.features.media.schema import (
    CompleteUploadRequest,
    CompleteUploadResponse,
    PresignedUploadRequest,
    PresignedUploadResponse
)
from app.features.media.service import complete_uploaded_image, create_presigned_upload_url


router = APIRouter(prefix="/media", tags=["media"])


@router.post("/presigned-upload", response_model=PresignedUploadResponse)
def presigned_upload(
    payload: PresignedUploadRequest,
    current_user: CurrentUser = Depends(get_current_user)
) -> PresignedUploadResponse:
    return create_presigned_upload_url(payload, current_user.id)


@router.post("/complete-upload", response_model=CompleteUploadResponse)
def complete_upload(
    payload: CompleteUploadRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
) -> CompleteUploadResponse:
    return complete_uploaded_image(db, payload, current_user.id)
