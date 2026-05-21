import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.trainers.model import (
    TrainerCredential,
    TrainerPortfolioLink,
    TrainerProfile,
    TrainerSpecialty,
    TrainerWorkExperience
)
from app.features.trainers.schema import TrainerProfileCreate, TrainerProfileUpsert


def trainer_profile_options():
    return (
        selectinload(TrainerProfile.specialties),
        selectinload(TrainerProfile.work_experiences),
        selectinload(TrainerProfile.credentials),
        selectinload(TrainerProfile.portfolio_links)
    )


def list_trainers(db: Session, params: PaginationParams) -> Page:
    statement = (
        select(TrainerProfile)
        .options(*trainer_profile_options())
        .where(TrainerProfile.deleted_at.is_(None))
        .order_by(TrainerProfile.created_at.desc())
    )
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def get_trainer_profile(db: Session, trainer_id: uuid.UUID) -> TrainerProfile | None:
    statement = (
        select(TrainerProfile)
        .options(*trainer_profile_options())
        .where(TrainerProfile.id == trainer_id, TrainerProfile.deleted_at.is_(None))
    )
    return db.scalar(statement)


def get_trainer_profile_by_user_id(db: Session, user_id: uuid.UUID) -> TrainerProfile | None:
    statement = (
        select(TrainerProfile)
        .options(*trainer_profile_options())
        .where(TrainerProfile.user_id == user_id, TrainerProfile.deleted_at.is_(None))
    )
    return db.scalar(statement)


def create_trainer_profile(db: Session, payload: TrainerProfileCreate) -> TrainerProfile:
    trainer = TrainerProfile(**payload.model_dump())
    db.add(trainer)
    db.commit()
    db.refresh(trainer)
    return trainer


def upsert_my_trainer_profile(db: Session, user_id: uuid.UUID, payload: TrainerProfileUpsert) -> TrainerProfile:
    trainer = get_trainer_profile_by_user_id(db, user_id)
    profile_values = payload.model_dump(
        exclude={"specialties", "work_experiences", "credentials", "portfolio_links"}
    )

    if trainer is None:
        trainer = TrainerProfile(user_id=user_id, **profile_values)
        db.add(trainer)
        db.flush()
    else:
        for key, value in profile_values.items():
            setattr(trainer, key, value)

    trainer.specialties = [
        TrainerSpecialty(**item.model_dump())
        for item in payload.specialties
    ]
    trainer.work_experiences = [
        TrainerWorkExperience(**item.model_dump())
        for item in payload.work_experiences
    ]
    trainer.credentials = [
        TrainerCredential(**item.model_dump())
        for item in payload.credentials
    ]
    trainer.portfolio_links = [
        TrainerPortfolioLink(**item.model_dump())
        for item in payload.portfolio_links
    ]

    db.commit()
    db.refresh(trainer)
    return get_trainer_profile(db, trainer.id) or trainer
