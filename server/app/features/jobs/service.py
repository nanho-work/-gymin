import uuid

from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page
from app.features.jobs import crud
from app.features.jobs.model import JobPost
from app.features.jobs.schema import JobPostCreate


def list_jobs(db: Session, params: PaginationParams) -> Page:
    return crud.list_jobs(db, params=params)


def list_my_jobs(db: Session, user_id: uuid.UUID, params: PaginationParams) -> Page:
    return crud.list_jobs_by_business_user_id(db, user_id, params=params)


def get_job(db: Session, job_id: uuid.UUID) -> JobPost | None:
    return crud.get_job(db, job_id)


def get_my_job(db: Session, job_id: uuid.UUID, user_id: uuid.UUID) -> JobPost | None:
    return crud.get_job_for_business_user_id(db, job_id, user_id)


def create_job(db: Session, payload: JobPostCreate, business_profile_id: uuid.UUID) -> JobPost:
    return crud.create_job(db, payload, business_profile_id)


def close_job(db: Session, job: JobPost) -> JobPost:
    return crud.close_job(db, job)
