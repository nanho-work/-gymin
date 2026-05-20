import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.applications.model import JobApplication
from app.features.applications.schema import JobApplicationCreate


def list_applications_by_job(
    db: Session,
    job_post_id: uuid.UUID,
    params: PaginationParams
) -> Page:
    statement = select(JobApplication).where(JobApplication.job_post_id == job_post_id).order_by(JobApplication.applied_at.desc())
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def create_application(db: Session, payload: JobApplicationCreate) -> JobApplication:
    application = JobApplication(**payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
