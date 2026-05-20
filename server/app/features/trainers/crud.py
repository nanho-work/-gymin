import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.trainers.model import TrainerProfile
from app.features.trainers.schema import TrainerProfileCreate


def list_trainers(db: Session, params: PaginationParams) -> Page:
    statement = select(TrainerProfile).where(TrainerProfile.deleted_at.is_(None)).order_by(TrainerProfile.created_at.desc())
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def get_trainer_profile(db: Session, trainer_id: uuid.UUID) -> TrainerProfile | None:
    statement = select(TrainerProfile).where(TrainerProfile.id == trainer_id, TrainerProfile.deleted_at.is_(None))
    return db.scalar(statement)


def create_trainer_profile(db: Session, payload: TrainerProfileCreate) -> TrainerProfile:
    trainer = TrainerProfile(**payload.model_dump())
    db.add(trainer)
    db.commit()
    db.refresh(trainer)
    return trainer
