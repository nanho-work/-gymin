import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.common.pagination import Page, PaginationParams, get_pagination_params
from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, require_business, require_trainer
from app.features.applications.schema import (
    JobApplicationCreate,
    JobApplicationRead,
    JobApplicationWithTrainerRead,
    MyJobApplicationRead
)
from app.features.applications.service import (
    create_application,
    list_applications_by_job,
    list_my_applications,
    mark_application_viewed
)


router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("/me", response_model=Page[MyJobApplicationRead])
def read_my_applications(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_trainer)
) -> Page[MyJobApplicationRead]:
    return list_my_applications(db, current_user, params=pagination)


@router.get("/jobs/{job_post_id}", response_model=Page[JobApplicationWithTrainerRead])
def read_applications_by_job(
    job_post_id: uuid.UUID,
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> Page[JobApplicationWithTrainerRead]:
    return list_applications_by_job(db, job_post_id, current_user, params=pagination)


@router.patch("/{application_id}/viewed", response_model=JobApplicationRead)
def mark_application_viewed_endpoint(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> JobApplicationRead:
    return mark_application_viewed(db, application_id, current_user)


@router.post("", response_model=JobApplicationRead, status_code=201)
def create_application_endpoint(
    payload: JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_trainer)
) -> JobApplicationRead:
    return create_application(db, payload, current_user)
