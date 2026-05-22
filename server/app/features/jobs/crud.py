import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.applications.model import JobApplication
from app.features.business.model import BusinessProfile
from app.features.jobs.model import JobPost
from app.features.jobs.schema import JobPostCreate, OwnerJobPostRead


def list_jobs(db: Session, params: PaginationParams) -> Page:
    statement = select(JobPost).where(JobPost.deleted_at.is_(None)).order_by(JobPost.created_at.desc())
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def list_jobs_by_business_user_id(db: Session, user_id: uuid.UUID, params: PaginationParams) -> Page:
    statement = (
        select(JobPost)
        .join(BusinessProfile, BusinessProfile.id == JobPost.business_profile_id)
        .where(
            BusinessProfile.user_id == user_id,
            JobPost.deleted_at.is_(None)
        )
        .order_by(JobPost.created_at.desc())
    )
    jobs, total = paginate_statement(db, statement, params)
    counts = get_application_counts_by_job_ids(db, [job.id for job in jobs])
    items = []

    for job in jobs:
        applicant_count, reviewed_applicant_count = counts.get(job.id, (0, 0))
        items.append(
            OwnerJobPostRead.model_validate(job).model_copy(
                update={
                    "applicant_count": applicant_count,
                    "reviewed_applicant_count": reviewed_applicant_count
                }
            )
        )

    return build_page(items, total, params)


def get_application_counts_by_job_ids(db: Session, job_ids: list[uuid.UUID]) -> dict[uuid.UUID, tuple[int, int]]:
    if not job_ids:
        return {}

    statement = (
        select(
            JobApplication.job_post_id,
            func.count(JobApplication.id),
            func.count(JobApplication.reviewed_at)
        )
        .where(JobApplication.job_post_id.in_(job_ids))
        .group_by(JobApplication.job_post_id)
    )
    return {
        job_id: (applicant_count, reviewed_count)
        for job_id, applicant_count, reviewed_count in db.execute(statement).all()
    }


def get_job(db: Session, job_id: uuid.UUID) -> JobPost | None:
    statement = select(JobPost).where(JobPost.id == job_id, JobPost.deleted_at.is_(None))
    return db.scalar(statement)


def get_job_for_business_user_id(db: Session, job_id: uuid.UUID, user_id: uuid.UUID) -> JobPost | None:
    statement = (
        select(JobPost)
        .join(BusinessProfile, BusinessProfile.id == JobPost.business_profile_id)
        .where(
            JobPost.id == job_id,
            BusinessProfile.user_id == user_id,
            JobPost.deleted_at.is_(None)
        )
    )
    return db.scalar(statement)


def create_job(db: Session, payload: JobPostCreate, business_profile_id: uuid.UUID) -> JobPost:
    now = datetime.now(timezone.utc)
    job = JobPost(
        **payload.model_dump(),
        business_profile_id=business_profile_id,
        status="open",
        published_at=now,
        updated_at=now
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def close_job(db: Session, job: JobPost) -> JobPost:
    now = datetime.now(timezone.utc)
    job.status = "closed"
    job.closed_at = now
    job.updated_at = now
    db.commit()
    db.refresh(job)
    return job
