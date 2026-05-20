import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.common.pagination import Page, PaginationParams, get_pagination_params
from app.db.session import get_db
from app.features.trainers.schema import TrainerProfileCreate, TrainerProfileRead
from app.features.trainers.service import create_trainer_profile, get_trainer_profile, list_trainers


router = APIRouter(prefix="/trainers", tags=["trainers"])


@router.get("", response_model=Page[TrainerProfileRead])
def read_trainers(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db)
) -> Page[TrainerProfileRead]:
    return list_trainers(db, params=pagination)


@router.get("/{trainer_id}", response_model=TrainerProfileRead)
def read_trainer(trainer_id: uuid.UUID, db: Session = Depends(get_db)) -> TrainerProfileRead:
    trainer = get_trainer_profile(db, trainer_id)
    if trainer is None:
        raise HTTPException(status_code=404, detail="트레이너 프로필을 찾을 수 없습니다.")
    return trainer


@router.post("", response_model=TrainerProfileRead, status_code=201)
def create_trainer_endpoint(payload: TrainerProfileCreate, db: Session = Depends(get_db)) -> TrainerProfileRead:
    return create_trainer_profile(db, payload)
