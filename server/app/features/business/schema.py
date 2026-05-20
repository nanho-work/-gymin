import uuid
from datetime import datetime

from pydantic import BaseModel


class BusinessProfileRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    owner_name: str | None
    phone: str | None
    verification_status: str
    created_at: datetime

    model_config = {"from_attributes": True}
