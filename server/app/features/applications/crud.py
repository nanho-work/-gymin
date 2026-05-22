import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.applications.model import JobApplication
from app.features.applications.schema import JobApplicationCreate


def list_applications_by_job(
    db: Session,
    job_post_id: uuid.UUID,
    params: PaginationParams
) -> Page:
    statement = (
        select(JobApplication)
        .options(joinedload(JobApplication.trainer_profile))
        .where(JobApplication.job_post_id == job_post_id)
        .order_by(JobApplication.applied_at.desc())
    )
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def list_applications_by_trainer_profile(
    db: Session,
    trainer_profile_id: uuid.UUID,
    params: PaginationParams
) -> Page:
    statement = (
        select(JobApplication)
        .options(joinedload(JobApplication.job_post))
        .where(JobApplication.trainer_profile_id == trainer_profile_id)
        .order_by(JobApplication.applied_at.desc())
    )
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def get_application_by_job_and_trainer(
    db: Session,
    job_post_id: uuid.UUID,
    trainer_profile_id: uuid.UUID
) -> JobApplication | None:
    statement = select(JobApplication).where(
        JobApplication.job_post_id == job_post_id,
        JobApplication.trainer_profile_id == trainer_profile_id
    )
    return db.scalar(statement)


def create_application(db: Session, payload: JobApplicationCreate, trainer_profile_id: uuid.UUID) -> JobApplication:
    application = JobApplication(**payload.model_dump(), trainer_profile_id=trainer_profile_id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
