import uuid
from typing import Literal

from pydantic import BaseModel, Field, field_validator


MediaEntityType = Literal["center", "trainer_profile", "job_post", "business_verification"]
MediaPurpose = Literal["profile", "representative", "gallery", "verification", "portfolio", "content"]


class PresignedUploadRequest(BaseModel):
    entity_type: MediaEntityType
    entity_id: uuid.UUID
    purpose: MediaPurpose
    filename: str = Field(min_length=1, max_length=255)
    content_type: str = Field(min_length=1, max_length=100)

    @field_validator("content_type")
    @classmethod
    def validate_image_content_type(cls, value: str) -> str:
        allowed_content_types = {"image/jpeg", "image/png", "image/webp"}
        if value not in allowed_content_types:
            raise ValueError("jpeg, png, webp 이미지만 업로드할 수 있습니다.")
        return value


class PresignedUploadResponse(BaseModel):
    upload_url: str
    object_key: str
    bucket: str
    expires_in: int


class CompleteUploadRequest(BaseModel):
    entity_type: MediaEntityType
    entity_id: uuid.UUID
    purpose: MediaPurpose
    object_key: str = Field(min_length=1, max_length=500)
    original_filename: str = Field(min_length=1, max_length=255)
    content_type: str = Field(min_length=1, max_length=100)
    file_size: int = Field(ge=0)
    sort_order: int = Field(default=0, ge=0)

    @field_validator("content_type")
    @classmethod
    def validate_image_content_type(cls, value: str) -> str:
        allowed_content_types = {"image/jpeg", "image/png", "image/webp"}
        if value not in allowed_content_types:
            raise ValueError("jpeg, png, webp 이미지만 업로드할 수 있습니다.")
        return value


class MediaVariantResponse(BaseModel):
    variant_type: str
    object_key: str
    width: int
    height: int
    file_size: int
    content_type: str
    url: str | None = None


class CompleteUploadResponse(BaseModel):
    id: uuid.UUID
    bucket: str
    object_key: str
    width: int
    height: int
    variants: list[MediaVariantResponse]


class MediaFileResponse(BaseModel):
    id: uuid.UUID
    entity_type: str
    entity_id: uuid.UUID
    purpose: str
    bucket: str
    object_key: str
    original_filename: str | None
    content_type: str | None
    file_size: int | None
    width: int | None
    height: int | None
    sort_order: int
    created_at: str
    variants: list[MediaVariantResponse]
