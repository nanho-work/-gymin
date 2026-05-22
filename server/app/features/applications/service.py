import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page
from app.features.applications import crud
from app.features.applications.model import JobApplication
from app.features.applications.schema import JobApplicationCreate
from app.features.auth.dependencies import CurrentUser
from app.features.jobs.crud import get_job
from app.features.media.crud import list_entity_media
from app.features.trainers.crud import get_trainer_profile_by_user_id


def list_applications_by_job(
    db: Session,
    job_post_id: uuid.UUID,
    params: PaginationParams
) -> Page:
    return crud.list_applications_by_job(db, job_post_id, params=params)


def list_my_applications(
    db: Session,
    current_user: CurrentUser,
    params: PaginationParams
) -> Page:
    trainer = get_trainer_profile_by_user_id(db, current_user.id)
    if trainer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="트레이너 프로필을 찾을 수 없습니다.")

    return crud.list_applications_by_trainer_profile(db, trainer.id, params=params)


def create_application(
    db: Session,
    payload: JobApplicationCreate,
    current_user: CurrentUser
) -> JobApplication:
    trainer = get_trainer_profile_by_user_id(db, current_user.id)
    if trainer is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="지원하려면 트레이너 프로필을 먼저 등록해 주세요.")

    missing_fields = get_missing_application_fields(db, trainer)
    if missing_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"지원 필수 항목을 먼저 채워 주세요: {', '.join(missing_fields)}"
        )

    job = get_job(db, payload.job_post_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="구인글을 찾을 수 없습니다.")
    if job.status != "open":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="마감된 구인글에는 지원할 수 없습니다.")

    existing_application = crud.get_application_by_job_and_trainer(db, payload.job_post_id, trainer.id)
    if existing_application is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="이미 지원한 구인글입니다.")

    return crud.create_application(db, payload, trainer.id)


def get_missing_application_fields(db: Session, trainer) -> list[str]:
    profile_media = list_entity_media(
        db,
        entity_type="trainer_profile",
        entity_id=trainer.id,
        purpose="profile"
    )
    checks = [
        ("대표 사진", bool(profile_media)),
        ("이름", bool(trainer.name)),
        ("나이", trainer.age is not None),
        ("성별", bool(trainer.gender)),
        ("연락처", bool(trainer.phone)),
        ("거주지역", bool(trainer.residence_sido or trainer.residence_sigungu))
    ]

    return [label for label, ready in checks if not ready]
