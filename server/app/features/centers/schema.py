import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.features.media.schema import MediaFileResponse


class CenterWrite(BaseModel):
    name: str
    sido: str
    sigungu: str
    detail_address: str
    industry: str
    operation_type: str | None = None
    introduction: str | None = None
    homepage_url: str | None = None
    instagram_url: str | None = None
    youtube_url: str | None = None


class CenterCreate(CenterWrite):
    pass


class CenterUpdate(CenterWrite):
    pass


class CenterSummary(BaseModel):
    id: uuid.UUID
    name: str
    sido: str
    sigungu: str
    detail_address: str
    industry: str
    operation_type: str | None = None
    verification_status: str
    status: str
    media: list[MediaFileResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class CenterRead(CenterWrite):
    id: uuid.UUID
    business_profile_id: uuid.UUID
    verification_status: str
    status: str
    created_at: datetime
    updated_at: datetime
    media: list[MediaFileResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}
