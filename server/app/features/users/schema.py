import uuid
from datetime import datetime

from pydantic import BaseModel


class UserRead(BaseModel):
    id: uuid.UUID
    display_name: str
    email: str | None
    phone: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
