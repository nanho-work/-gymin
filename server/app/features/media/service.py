import uuid
from pathlib import Path

import boto3
from fastapi import HTTPException, status

from app.core.config import get_settings
from app.features.media.schema import PresignedUploadRequest, PresignedUploadResponse


ALLOWED_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def build_object_key(payload: PresignedUploadRequest) -> str:
    suffix = Path(payload.filename).suffix.lower()
    if suffix not in ALLOWED_IMAGE_SUFFIXES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="jpg, png, webp 파일만 업로드할 수 있습니다."
        )

    file_id = uuid.uuid4()
    return f"{payload.entity_type}/{payload.entity_id}/{payload.purpose}/{file_id}{suffix}"


def create_presigned_upload_url(payload: PresignedUploadRequest) -> PresignedUploadResponse:
    settings = get_settings()
    object_key = build_object_key(payload)
    s3_client = boto3.client("s3", region_name=settings.aws_region)
    upload_url = s3_client.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": settings.s3_bucket_name,
            "Key": object_key,
            "ContentType": payload.content_type
        },
        ExpiresIn=settings.s3_presigned_url_expires_seconds
    )
    return PresignedUploadResponse(
        upload_url=upload_url,
        object_key=object_key,
        bucket=settings.s3_bucket_name,
        expires_in=settings.s3_presigned_url_expires_seconds
    )
