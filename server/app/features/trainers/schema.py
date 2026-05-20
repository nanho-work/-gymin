import uuid
from datetime import date, datetime

from pydantic import BaseModel


class TrainerProfileCreate(BaseModel):
    user_id: uuid.UUID
    name: str | None = None
    birth_date: date | None = None
    age: int | None = None
    gender: str | None = None
    phone: str | None = None
    residence_sido: str | None = None
    residence_sigungu: str | None = None
    desired_area_text: str | None = None
    headline: str | None = None
    experience_years: int | None = None
    work_type: str | None = None
    availability: str | None = None
    summary: str | None = None


class TrainerProfileRead(TrainerProfileCreate):
    id: uuid.UUID
    profile_status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
