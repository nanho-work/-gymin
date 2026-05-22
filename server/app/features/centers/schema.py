import uuid
from datetime import datetime

from pydantic import BaseModel


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


class CenterRead(CenterWrite):
    id: uuid.UUID
    business_profile_id: uuid.UUID
    verification_status: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
