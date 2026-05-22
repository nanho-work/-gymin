import uuid

from sqlalchemy.orm import Session

from app.common.age import calculate_age_from_birth_year
from app.common.pagination import PaginationParams, Page
from app.features.media import crud as media_crud
from app.features.media.service import to_media_file_response
from app.features.trainers import crud
from app.features.trainers.model import TrainerProfile
from app.features.trainers.schema import TrainerProfileCreate, TrainerProfileRead, TrainerProfileUpsert


def list_trainers(db: Session, params: PaginationParams) -> Page:
    return crud.list_trainers(db, params=params)


def get_trainer_profile(db: Session, trainer_id: uuid.UUID) -> TrainerProfile | None:
    return crud.get_trainer_profile(db, trainer_id)


def get_my_trainer_profile(db: Session, user_id: uuid.UUID) -> TrainerProfile | None:
    return crud.get_trainer_profile_by_user_id(db, user_id)


def create_trainer_profile(db: Session, payload: TrainerProfileCreate) -> TrainerProfile:
    return crud.create_trainer_profile(db, payload)


def upsert_my_trainer_profile(db: Session, user_id: uuid.UUID, payload: TrainerProfileUpsert) -> TrainerProfile:
    return crud.upsert_my_trainer_profile(db, user_id, payload)


def to_trainer_profile_read(db: Session, trainer: TrainerProfile) -> TrainerProfileRead:
    response = TrainerProfileRead.model_validate(trainer)
    response.age = calculate_age_from_birth_year(trainer.birth_year)
    media_files = media_crud.list_entity_media(
        db,
        entity_type="trainer_profile",
        entity_id=trainer.id
    )
    response.media = [to_media_file_response(media_file) for media_file in media_files]
    return response
