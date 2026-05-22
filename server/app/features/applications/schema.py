import uuid
from datetime import datetime

from pydantic import BaseModel

from app.features.jobs.schema import JobPostRead


class JobApplicationCreate(BaseModel):
    job_post_id: uuid.UUID
    message: str | None = None


class JobApplicationRead(BaseModel):
    id: uuid.UUID
    job_post_id: uuid.UUID
    trainer_profile_id: uuid.UUID
    message: str | None = None
    status: str
    applied_at: datetime

    model_config = {"from_attributes": True}


class MyJobApplicationRead(JobApplicationRead):
    job_post: JobPostRead
