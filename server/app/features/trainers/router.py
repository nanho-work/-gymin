import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.common.pagination import Page, PaginationParams, get_pagination_params
from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, require_trainer
from app.features.trainers.schema import TrainerProfileCreate, TrainerProfileRead, TrainerProfileUpsert
from app.features.trainers.service import (
    create_trainer_profile,
    get_my_trainer_profile,
    get_trainer_profile,
    list_trainers,
    to_trainer_profile_read,
    upsert_my_trainer_profile
)


router = APIRouter(prefix="/trainers", tags=["trainers"])


@router.get("", response_model=Page[TrainerProfileRead])
def read_trainers(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db)
) -> Page[TrainerProfileRead]:
    return list_trainers(db, params=pagination)


@router.get("/me", response_model=TrainerProfileRead)
def read_my_trainer_profile(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_trainer)
) -> TrainerProfileRead:
    trainer = get_my_trainer_profile(db, current_user.id)
    if trainer is None:
        raise HTTPException(status_code=404, detail="트레이너 프로필을 찾을 수 없습니다.")
    return to_trainer_profile_read(db, trainer)


@router.put("/me", response_model=TrainerProfileRead)
def upsert_my_trainer_profile_endpoint(
    payload: TrainerProfileUpsert,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_trainer)
) -> TrainerProfileRead:
    trainer = upsert_my_trainer_profile(db, current_user.id, payload)
    return to_trainer_profile_read(db, trainer)


@router.get("/{trainer_id}", response_model=TrainerProfileRead)
def read_trainer(trainer_id: uuid.UUID, db: Session = Depends(get_db)) -> TrainerProfileRead:
    trainer = get_trainer_profile(db, trainer_id)
    if trainer is None:
        raise HTTPException(status_code=404, detail="트레이너 프로필을 찾을 수 없습니다.")
    return to_trainer_profile_read(db, trainer)


@router.post("", response_model=TrainerProfileRead, status_code=201)
def create_trainer_endpoint(
    payload: TrainerProfileCreate,
    db: Session = Depends(get_db),
    _current_user: CurrentUser = Depends(require_trainer)
) -> TrainerProfileRead:
    return create_trainer_profile(db, payload)
