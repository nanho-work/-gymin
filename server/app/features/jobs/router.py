import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.common.pagination import Page, PaginationParams, get_pagination_params
from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, require_business
from app.features.jobs.schema import JobPostCreate, JobPostRead
from app.features.jobs.service import close_job, create_job, get_job, list_jobs


router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=Page[JobPostRead])
def read_jobs(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db)
) -> Page[JobPostRead]:
    return list_jobs(db, params=pagination)


@router.get("/{job_id}", response_model=JobPostRead)
def read_job(job_id: uuid.UUID, db: Session = Depends(get_db)) -> JobPostRead:
    job = get_job(db, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="구인글을 찾을 수 없습니다.")
    return job


@router.post("", response_model=JobPostRead, status_code=201)
def create_job_endpoint(
    payload: JobPostCreate,
    db: Session = Depends(get_db),
    _current_user: CurrentUser = Depends(require_business)
) -> JobPostRead:
    return create_job(db, payload)


@router.patch("/{job_id}/close", response_model=JobPostRead)
def close_job_endpoint(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_user: CurrentUser = Depends(require_business)
) -> JobPostRead:
    job = get_job(db, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="구인글을 찾을 수 없습니다.")
    if job.status == "closed":
        return job
    return close_job(db, job)
