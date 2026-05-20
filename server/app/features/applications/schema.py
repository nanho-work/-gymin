import uuid
from datetime import datetime

from pydantic import BaseModel


class JobApplicationCreate(BaseModel):
    job_post_id: uuid.UUID
    trainer_profile_id: uuid.UUID
    message: str | None = None


class JobApplicationRead(JobApplicationCreate):
    id: uuid.UUID
    status: str
    applied_at: datetime

    model_config = {"from_attributes": True}
