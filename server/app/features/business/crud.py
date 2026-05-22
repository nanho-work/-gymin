import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.features.business.model import BusinessProfile


def get_business_profile(db: Session, profile_id: uuid.UUID) -> BusinessProfile | None:
    return db.get(BusinessProfile, profile_id)


def get_business_profile_by_user_id(db: Session, user_id: uuid.UUID) -> BusinessProfile | None:
    statement = select(BusinessProfile).where(BusinessProfile.user_id == user_id)
    return db.scalar(statement)


def create_business_profile(
    db: Session,
    *,
    user_id: uuid.UUID,
    owner_name: str | None = None
) -> BusinessProfile:
    profile = BusinessProfile(
        user_id=user_id,
        owner_name=owner_name,
        verification_status="not_requested"
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
