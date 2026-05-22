import uuid
from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator

from app.common.phone import normalize_phone_digits
from app.features.media.schema import MediaFileResponse


class TrainerSpecialtyWrite(BaseModel):
    name: str
    sort_order: int = 0


class TrainerSpecialtyRead(TrainerSpecialtyWrite):
    id: uuid.UUID

    model_config = {"from_attributes": True}


class TrainerWorkExperienceWrite(BaseModel):
    center_name: str
    start_date: date | None = None
    end_date: date | None = None
    period_text: str | None = None
    role_description: str
    sort_order: int = 0


class TrainerWorkExperienceRead(TrainerWorkExperienceWrite):
    id: uuid.UUID

    model_config = {"from_attributes": True}


class TrainerCredentialWrite(BaseModel):
    credential_type: str = "certificate"
    title: str
    issued_by: str | None = None
    issued_at: date | None = None
    sort_order: int = 0


class TrainerCredentialRead(TrainerCredentialWrite):
    id: uuid.UUID

    model_config = {"from_attributes": True}


class TrainerPortfolioLinkWrite(BaseModel):
    label: str
    url: str
    sort_order: int = 0


class TrainerPortfolioLinkRead(TrainerPortfolioLinkWrite):
    id: uuid.UUID

    model_config = {"from_attributes": True}


class TrainerProfileCreate(BaseModel):
    user_id: uuid.UUID
    name: str | None = None
    birth_year: int | None = None
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

    @field_validator("birth_year")
    @classmethod
    def validate_birth_year(cls, value: int | None) -> int | None:
        if value is None:
            return value

        current_year = date.today().year
        age = current_year - value
        if age < 14 or age > 100:
            raise ValueError("출생년도는 만 14세 이상 100세 이하 범위로 입력해 주세요.")

        return value

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, value: str | None) -> str | None:
        return normalize_phone_digits(value)


class TrainerProfileUpsert(BaseModel):
    name: str | None = None
    birth_year: int | None = None
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
    profile_status: str = "draft"
    specialties: list[TrainerSpecialtyWrite] = Field(default_factory=list)
    work_experiences: list[TrainerWorkExperienceWrite] = Field(default_factory=list)
    credentials: list[TrainerCredentialWrite] = Field(default_factory=list)
    portfolio_links: list[TrainerPortfolioLinkWrite] = Field(default_factory=list)

    @field_validator("birth_year")
    @classmethod
    def validate_birth_year(cls, value: int | None) -> int | None:
        if value is None:
            return value

        current_year = date.today().year
        age = current_year - value
        if age < 14 or age > 100:
            raise ValueError("출생년도는 만 14세 이상 100세 이하 범위로 입력해 주세요.")

        return value

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, value: str | None) -> str | None:
        return normalize_phone_digits(value)


class TrainerProfileRead(TrainerProfileCreate):
    id: uuid.UUID
    age: int | None = None
    profile_status: str
    created_at: datetime
    updated_at: datetime
    specialties: list[TrainerSpecialtyRead] = Field(default_factory=list)
    work_experiences: list[TrainerWorkExperienceRead] = Field(default_factory=list)
    credentials: list[TrainerCredentialRead] = Field(default_factory=list)
    portfolio_links: list[TrainerPortfolioLinkRead] = Field(default_factory=list)
    media: list[MediaFileResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}
