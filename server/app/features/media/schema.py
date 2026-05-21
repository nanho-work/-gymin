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
