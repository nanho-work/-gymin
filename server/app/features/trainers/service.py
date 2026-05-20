import uuid

from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page
from app.features.trainers import crud
from app.features.trainers.model import TrainerProfile
from app.features.trainers.schema import TrainerProfileCreate


def list_trainers(db: Session, params: PaginationParams) -> Page:
    return crud.list_trainers(db, params=params)


def get_trainer_profile(db: Session, trainer_id: uuid.UUID) -> TrainerProfile | None:
    return crud.get_trainer_profile(db, trainer_id)


def create_trainer_profile(db: Session, payload: TrainerProfileCreate) -> TrainerProfile:
    return crud.create_trainer_profile(db, payload)
