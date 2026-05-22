import uuid

from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page
from app.features.jobs import crud
from app.features.jobs.model import JobPost
from app.features.jobs.schema import JobPostCreate, JobPostRead, JobPostSearchParams
from app.features.media import crud as media_crud
from app.features.media.model import MediaFile
from app.features.media.service import to_media_file_response


def list_jobs(db: Session, params: PaginationParams, search: JobPostSearchParams | None = None) -> Page:
    page = crud.list_jobs(db, params=params, search=search)
    return page.model_copy(
        update={
            "items": [
                to_job_post_read(db, job, include_center_media=True)
                for job in page.items
            ]
        }
    )


def list_my_jobs(db: Session, user_id: uuid.UUID, params: PaginationParams) -> Page:
    return crud.list_jobs_by_business_user_id(db, user_id, params=params)


def get_job(db: Session, job_id: uuid.UUID) -> JobPost | None:
    return crud.get_job(db, job_id)


def get_my_job(db: Session, job_id: uuid.UUID, user_id: uuid.UUID) -> JobPost | None:
    return crud.get_job_for_business_user_id(db, job_id, user_id)


def create_job(db: Session, payload: JobPostCreate, business_profile_id: uuid.UUID) -> JobPost:
    return crud.create_job(db, payload, business_profile_id)


def close_job(db: Session, job: JobPost) -> JobPost:
    return crud.close_job(db, job)


def to_job_post_read(
    db: Session,
    job: JobPost,
    *,
    include_center_media: bool = False,
    include_job_media: bool = False
) -> JobPostRead:
    response = JobPostRead.model_validate(job)

    if include_center_media and job.center is not None and response.center is not None:
        center_media = list_center_preview_media(db, job.center.id)
        response.center = response.center.model_copy(
            update={
                "media": [to_media_file_response(media_file) for media_file in center_media]
            }
        )

    if include_job_media:
        job_media = media_crud.list_entity_media(
            db,
            entity_type="job_post",
            entity_id=job.id,
            purpose="content"
        )
        response.media = [to_media_file_response(media_file) for media_file in job_media]

    return response


def list_center_preview_media(db: Session, center_id: uuid.UUID) -> list[MediaFile]:
    representative_media = media_crud.list_entity_media(
        db,
        entity_type="center",
        entity_id=center_id,
        purpose="representative"
    )
    if representative_media:
        return representative_media[:1]

    gallery_media = media_crud.list_entity_media(
        db,
        entity_type="center",
        entity_id=center_id,
        purpose="gallery"
    )
    return gallery_media[:1]
