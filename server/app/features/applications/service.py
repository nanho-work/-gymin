import uuid

from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page
from app.features.applications import crud
from app.features.applications.model import JobApplication
from app.features.applications.schema import JobApplicationCreate


def list_applications_by_job(
    db: Session,
    job_post_id: uuid.UUID,
    params: PaginationParams
) -> Page:
    return crud.list_applications_by_job(db, job_post_id, params=params)


def create_application(db: Session, payload: JobApplicationCreate) -> JobApplication:
    return crud.create_application(db, payload)
