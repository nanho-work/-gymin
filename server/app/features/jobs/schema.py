import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.features.centers.schema import CenterSummary
from app.features.media.schema import MediaFileResponse


class JobPostWrite(BaseModel):
    center_id: uuid.UUID
    title: str
    job_role: str
    employment_type: str
    start_date_text: str | None = None
    work_days: str | None = None
    work_hours: str | None = None
    rest_time: str | None = None
    base_pay: str | None = None
    insurance_type: str | None = None
    incentive: str | None = None
    settlement_type: str | None = None
    sales_pressure: str | None = None
    member_handover: str | None = None
    vacation: str | None = None
    support_detail: str | None = None
    description: str | None = None


class JobPostCreate(JobPostWrite):
    pass


class JobPostRead(JobPostWrite):
    id: uuid.UUID
    business_profile_id: uuid.UUID
    center: CenterSummary | None = None
    media: list[MediaFileResponse] = Field(default_factory=list)
    status: str
    published_at: datetime | None
    closed_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OwnerJobPostRead(JobPostRead):
    applicant_count: int = 0
    reviewed_applicant_count: int = 0
