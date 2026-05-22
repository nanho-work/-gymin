import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.applications.model import JobApplication
from app.features.applications.schema import JobApplicationCreate
from app.features.business.model import BusinessProfile
from app.features.jobs.model import JobPost


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


def get_job_for_business(
    db: Session,
    job_post_id: uuid.UUID,
    business_user_id: uuid.UUID
) -> JobPost | None:
    statement = (
        select(JobPost)
        .join(BusinessProfile, BusinessProfile.id == JobPost.business_profile_id)
        .where(
            JobPost.id == job_post_id,
            JobPost.deleted_at.is_(None),
            BusinessProfile.user_id == business_user_id
        )
    )
    return db.scalar(statement)


def get_application_for_business(
    db: Session,
    application_id: uuid.UUID,
    business_user_id: uuid.UUID
) -> JobApplication | None:
    statement = (
        select(JobApplication)
        .join(JobPost, JobPost.id == JobApplication.job_post_id)
        .join(BusinessProfile, BusinessProfile.id == JobPost.business_profile_id)
        .where(
            JobApplication.id == application_id,
            BusinessProfile.user_id == business_user_id
        )
    )
    return db.scalar(statement)


def mark_application_viewed(db: Session, application: JobApplication) -> JobApplication:
    if application.reviewed_at is None:
        application.reviewed_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(application)
    return application


def create_application(db: Session, payload: JobApplicationCreate, trainer_profile_id: uuid.UUID) -> JobApplication:
    application = JobApplication(**payload.model_dump(), trainer_profile_id=trainer_profile_id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
