import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.jobs.model import JobPost
from app.features.jobs.schema import JobPostCreate


def list_jobs(db: Session, params: PaginationParams) -> Page:
    statement = select(JobPost).where(JobPost.deleted_at.is_(None)).order_by(JobPost.created_at.desc())
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def get_job(db: Session, job_id: uuid.UUID) -> JobPost | None:
    statement = select(JobPost).where(JobPost.id == job_id, JobPost.deleted_at.is_(None))
    return db.scalar(statement)


def create_job(db: Session, payload: JobPostCreate) -> JobPost:
    now = datetime.now(timezone.utc)
    job = JobPost(**payload.model_dump(), status="open", published_at=now, updated_at=now)
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
