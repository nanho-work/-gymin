import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, get_current_user
from app.features.media import crud
from app.features.media.schema import (
    CompleteUploadRequest,
    CompleteUploadResponse,
    MediaEntityType,
    MediaFileResponse,
    MediaPurpose,
    PresignedUploadRequest,
    PresignedUploadResponse
)
from app.features.media.service import (
    complete_uploaded_image,
    create_presigned_upload_url,
    delete_media_file,
    to_media_file_response
)


router = APIRouter(prefix="/media", tags=["media"])


@router.get("", response_model=list[MediaFileResponse])
def read_entity_media(
    entity_type: Annotated[MediaEntityType, Query()],
    entity_id: Annotated[uuid.UUID, Query()],
    purpose: Annotated[MediaPurpose | None, Query()] = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
) -> list[MediaFileResponse]:
    media_files = crud.list_entity_media(
        db,
        entity_type=entity_type,
        entity_id=entity_id,
        purpose=purpose
    )
    if any(media_file.owner_user_id != current_user.id for media_file in media_files):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="미디어 소유자를 확인할 수 없습니다.")

    return [to_media_file_response(media_file) for media_file in media_files]


@router.delete("/{media_file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_file_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
) -> None:
    media_file = crud.get_media_file(db, media_file_id)
    if media_file is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="이미지를 찾을 수 없습니다.")
    if media_file.owner_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="미디어 소유자를 확인할 수 없습니다.")

    delete_media_file(db, media_file)


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
