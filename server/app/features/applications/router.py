import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.common.pagination import Page, PaginationParams, get_pagination_params
from app.db.session import get_db
from app.features.applications.schema import JobApplicationCreate, JobApplicationRead
from app.features.applications.service import create_application, list_applications_by_job


router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("/jobs/{job_post_id}", response_model=Page[JobApplicationRead])
def read_applications_by_job(
    job_post_id: uuid.UUID,
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db)
) -> Page[JobApplicationRead]:
    return list_applications_by_job(db, job_post_id, params=pagination)


@router.post("", response_model=JobApplicationRead, status_code=201)
def create_application_endpoint(
    payload: JobApplicationCreate,
    db: Session = Depends(get_db)
) -> JobApplicationRead:
    return create_application(db, payload)
