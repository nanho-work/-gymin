import uuid
from datetime import datetime

from pydantic import BaseModel


class CenterCreate(BaseModel):
    business_profile_id: uuid.UUID
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


class CenterRead(CenterCreate):
    id: uuid.UUID
    verification_status: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
