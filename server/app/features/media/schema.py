import uuid

from pydantic import BaseModel


class PresignedUploadRequest(BaseModel):
    owner_user_id: uuid.UUID
    entity_type: str
    entity_id: uuid.UUID
    purpose: str
    filename: str
    content_type: str


class PresignedUploadResponse(BaseModel):
    upload_url: str
    object_key: str
    bucket: str
    expires_in: int
