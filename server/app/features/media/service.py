import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path

import boto3
from botocore.exceptions import BotoCoreError, ClientError, NoCredentialsError
from fastapi import HTTPException, status
from PIL import Image, ImageOps, UnidentifiedImageError
from sqlalchemy import update
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.features.media.model import MediaFile, MediaFileVariant
from app.features.media.schema import (
    CompleteUploadRequest,
    CompleteUploadResponse,
    MediaFileResponse,
    MediaVariantResponse,
    PresignedUploadRequest,
    PresignedUploadResponse
)


ALLOWED_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
VARIANT_CONTENT_TYPE = "image/webp"
MAX_SERVER_PROCESSING_BYTES = 12 * 1024 * 1024
SINGLE_PRIMARY_PURPOSES = {"profile", "representative"}
VIEW_URL_EXPIRES_SECONDS = 300


@dataclass(frozen=True)
class ImageVariant:
    variant_type: str
    object_key: str
    width: int
    height: int
    file_size: int
    content: bytes


def build_object_key(payload: PresignedUploadRequest, owner_user_id: uuid.UUID) -> str:
    suffix = Path(payload.filename).suffix.lower()
    if suffix not in ALLOWED_IMAGE_SUFFIXES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="jpg, png, webp 파일만 업로드할 수 있습니다."
        )

    file_id = uuid.uuid4()
    return f"users/{owner_user_id}/{payload.entity_type}/{payload.entity_id}/{payload.purpose}/{file_id}{suffix}"


def build_variant_key(source_object_key: str, variant_type: str) -> str:
    source_path = Path(source_object_key)
    return f"{source_path.with_suffix('')}/{variant_type}.webp"


def get_variant_bounds(purpose: str, variant_type: str) -> tuple[int, int]:
    if variant_type == "thumbnail":
        if purpose in {"profile", "representative"}:
            return (240, 320)
        return (360, 360)

    if variant_type == "medium":
        if purpose in {"profile", "representative"}:
            return (600, 800)
        return (1400, 1400)

    return (2000, 2000)


def render_webp_variant(image: Image.Image, purpose: str, variant_type: str) -> tuple[bytes, int, int]:
    converted_image = image.copy()
    converted_image.thumbnail(get_variant_bounds(purpose, variant_type), Image.Resampling.LANCZOS)

    if converted_image.mode not in {"RGB", "RGBA"}:
        converted_image = converted_image.convert("RGB")

    output = BytesIO()
    converted_image.save(output, format="WEBP", quality=84, method=4)
    return output.getvalue(), converted_image.width, converted_image.height


def create_image_variants(source_bytes: bytes, source_object_key: str, purpose: str) -> list[ImageVariant]:
    if len(source_bytes) > MAX_SERVER_PROCESSING_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미지 파일이 너무 큽니다. 12MB 이하 이미지만 처리할 수 있습니다."
        )

    try:
        with Image.open(BytesIO(source_bytes)) as opened_image:
            normalized_image = ImageOps.exif_transpose(opened_image)
            normalized_image.load()
            variants = []
            for variant_type in ("original", "medium", "thumbnail"):
                content, width, height = render_webp_variant(normalized_image, purpose, variant_type)
                variants.append(
                    ImageVariant(
                        variant_type=variant_type,
                        object_key=build_variant_key(source_object_key, variant_type),
                        width=width,
                        height=height,
                        file_size=len(content),
                        content=content
                    )
                )
            return variants
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미지 파일을 읽을 수 없습니다.") from exc


def ensure_owned_object_key(payload: CompleteUploadRequest, owner_user_id: uuid.UUID) -> None:
    expected_prefix = f"users/{owner_user_id}/{payload.entity_type}/{payload.entity_id}/{payload.purpose}/"
    if not payload.object_key.startswith(expected_prefix):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="업로드 파일 소유자를 확인할 수 없습니다.")


def create_presigned_upload_url(payload: PresignedUploadRequest, owner_user_id: uuid.UUID) -> PresignedUploadResponse:
    settings = get_settings()
    object_key = build_object_key(payload, owner_user_id)
    s3_client = boto3.client("s3", region_name=settings.aws_region)
    try:
        upload_url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": settings.s3_bucket_name,
                "Key": object_key,
                "ContentType": payload.content_type
            },
            ExpiresIn=settings.s3_presigned_url_expires_seconds
        )
    except NoCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="S3 업로드 권한을 찾을 수 없습니다. EC2 IAM Role 연결 상태를 확인해 주세요."
        ) from exc
    except (BotoCoreError, ClientError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="S3 업로드 URL 생성에 실패했습니다."
        ) from exc

    return PresignedUploadResponse(
        upload_url=upload_url,
        object_key=object_key,
        bucket=settings.s3_bucket_name,
        expires_in=settings.s3_presigned_url_expires_seconds
    )


def create_presigned_view_url(bucket: str, object_key: str) -> str:
    settings = get_settings()
    s3_client = boto3.client("s3", region_name=settings.aws_region)
    try:
        return s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": bucket, "Key": object_key},
            ExpiresIn=VIEW_URL_EXPIRES_SECONDS
        )
    except NoCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="S3 조회 권한을 찾을 수 없습니다. EC2 IAM Role 연결 상태를 확인해 주세요."
        ) from exc
    except (BotoCoreError, ClientError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="S3 이미지 조회 URL 생성에 실패했습니다."
        ) from exc


def to_media_file_response(media_file: MediaFile) -> MediaFileResponse:
    return MediaFileResponse(
        id=media_file.id,
        entity_type=media_file.entity_type,
        entity_id=media_file.entity_id,
        purpose=media_file.purpose,
        bucket=media_file.bucket,
        object_key=media_file.object_key,
        original_filename=media_file.original_filename,
        content_type=media_file.content_type,
        file_size=media_file.file_size,
        width=media_file.width,
        height=media_file.height,
        sort_order=media_file.sort_order,
        created_at=media_file.created_at.isoformat(),
        variants=[
            MediaVariantResponse(
                variant_type=variant.variant_type,
                object_key=variant.object_key,
                width=variant.width,
                height=variant.height,
                file_size=variant.file_size,
                content_type=variant.content_type,
                url=create_presigned_view_url(variant.bucket, variant.object_key)
            )
            for variant in sorted(media_file.variants, key=lambda item: item.variant_type)
        ]
    )


def delete_media_file(db: Session, media_file: MediaFile) -> None:
    settings = get_settings()
    object_keys = {media_file.object_key, *(variant.object_key for variant in media_file.variants)}

    db.execute(
        update(MediaFile)
        .where(MediaFile.id == media_file.id, MediaFile.deleted_at.is_(None))
        .values(status="deleted", deleted_at=datetime.now(timezone.utc))
    )
    db.commit()

    s3_client = boto3.client("s3", region_name=settings.aws_region)
    for object_key in object_keys:
        try:
            s3_client.delete_object(Bucket=settings.s3_bucket_name, Key=object_key)
        except (BotoCoreError, ClientError, NoCredentialsError):
            pass


def complete_uploaded_image(
    db: Session,
    payload: CompleteUploadRequest,
    owner_user_id: uuid.UUID
) -> CompleteUploadResponse:
    settings = get_settings()
    ensure_owned_object_key(payload, owner_user_id)
    s3_client = boto3.client("s3", region_name=settings.aws_region)

    try:
        source_object = s3_client.get_object(Bucket=settings.s3_bucket_name, Key=payload.object_key)
        source_bytes = source_object["Body"].read()
        variants = create_image_variants(source_bytes, payload.object_key, payload.purpose)

        for variant in variants:
            s3_client.put_object(
                Bucket=settings.s3_bucket_name,
                Key=variant.object_key,
                Body=variant.content,
                ContentType=VARIANT_CONTENT_TYPE
            )

        original_variant = next(variant for variant in variants if variant.variant_type == "original")
        if payload.purpose in SINGLE_PRIMARY_PURPOSES:
            db.execute(
                update(MediaFile)
                .where(
                    MediaFile.owner_user_id == owner_user_id,
                    MediaFile.entity_type == payload.entity_type,
                    MediaFile.entity_id == payload.entity_id,
                    MediaFile.purpose == payload.purpose,
                    MediaFile.deleted_at.is_(None)
                )
                .values(status="deleted", deleted_at=datetime.now(timezone.utc))
            )

        media_file = MediaFile(
            owner_user_id=owner_user_id,
            entity_type=payload.entity_type,
            entity_id=payload.entity_id,
            purpose=payload.purpose,
            bucket=settings.s3_bucket_name,
            object_key=original_variant.object_key,
            original_filename=payload.original_filename,
            content_type=VARIANT_CONTENT_TYPE,
            file_size=original_variant.file_size,
            width=original_variant.width,
            height=original_variant.height,
            sort_order=payload.sort_order,
            status="uploaded"
        )
        db.add(media_file)
        db.flush()

        variant_models = [
            MediaFileVariant(
                media_file_id=media_file.id,
                variant_type=variant.variant_type,
                bucket=settings.s3_bucket_name,
                object_key=variant.object_key,
                content_type=VARIANT_CONTENT_TYPE,
                file_size=variant.file_size,
                width=variant.width,
                height=variant.height
            )
            for variant in variants
        ]
        db.add_all(variant_models)
        db.commit()
        db.refresh(media_file)

        try:
            s3_client.delete_object(Bucket=settings.s3_bucket_name, Key=payload.object_key)
        except (BotoCoreError, ClientError):
            pass

        return CompleteUploadResponse(
            id=media_file.id,
            bucket=settings.s3_bucket_name,
            object_key=media_file.object_key,
            width=media_file.width or 0,
            height=media_file.height or 0,
            variants=[
                MediaVariantResponse(
                    variant_type=variant.variant_type,
                    object_key=variant.object_key,
                    width=variant.width,
                    height=variant.height,
                    file_size=variant.file_size,
                    content_type=VARIANT_CONTENT_TYPE
                )
                for variant in variants
            ]
        )
    except HTTPException:
        db.rollback()
        raise
    except NoCredentialsError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="S3 업로드 권한을 찾을 수 없습니다. EC2 IAM Role 연결 상태를 확인해 주세요."
        ) from exc
    except (BotoCoreError, ClientError) as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="S3 이미지 처리에 실패했습니다."
        ) from exc
