from fastapi import APIRouter

from app.features.media.schema import PresignedUploadRequest, PresignedUploadResponse
from app.features.media.service import create_presigned_upload_url


router = APIRouter(prefix="/media", tags=["media"])


@router.post("/presigned-upload", response_model=PresignedUploadResponse)
def presigned_upload(payload: PresignedUploadRequest) -> PresignedUploadResponse:
    return create_presigned_upload_url(payload)
