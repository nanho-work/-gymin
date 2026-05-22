import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.common.pagination import Page, PaginationParams, get_pagination_params
from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, require_business
from app.features.business.service import ensure_business_profile
from app.features.centers.service import get_center
from app.features.jobs.schema import JobPostCreate, JobPostRead, OwnerJobPostRead
from app.features.jobs.service import (
    close_job,
    create_job,
    get_job,
    get_my_job,
    list_jobs,
    list_my_jobs,
    to_job_post_read
)


router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=Page[JobPostRead])
def read_jobs(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db)
) -> Page[JobPostRead]:
    return list_jobs(db, params=pagination)


@router.get("/me", response_model=Page[OwnerJobPostRead])
def read_my_jobs(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> Page[OwnerJobPostRead]:
    return list_my_jobs(db, current_user.id, params=pagination)


@router.get("/{job_id}", response_model=JobPostRead)
def read_job(job_id: uuid.UUID, db: Session = Depends(get_db)) -> JobPostRead:
    job = get_job(db, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="구인글을 찾을 수 없습니다.")
    return to_job_post_read(db, job, include_center_media=True, include_job_media=True)


@router.post("", response_model=JobPostRead, status_code=201)
def create_job_endpoint(
    payload: JobPostCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> JobPostRead:
    profile = ensure_business_profile(db, current_user.id, owner_name=current_user.display_name)
    center = get_center(db, payload.center_id)
    if center is None or center.business_profile_id != profile.id:
        raise HTTPException(status_code=404, detail="센터를 찾을 수 없습니다.")

    return create_job(db, payload, profile.id)


@router.patch("/{job_id}/close", response_model=JobPostRead)
def close_job_endpoint(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> JobPostRead:
    job = get_my_job(db, job_id, current_user.id)
    if job is None:
        raise HTTPException(status_code=404, detail="구인글을 찾을 수 없습니다.")
    if job.status == "closed":
        return job
    return close_job(db, job)
