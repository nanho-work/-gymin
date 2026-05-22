import uuid

from sqlalchemy.orm import Session

from app.features.business import crud
from app.features.business.model import BusinessProfile


def get_business_profile_or_none(db: Session, profile_id: uuid.UUID) -> BusinessProfile | None:
    return crud.get_business_profile(db, profile_id)


def get_business_profile_by_user_id_or_none(db: Session, user_id: uuid.UUID) -> BusinessProfile | None:
    return crud.get_business_profile_by_user_id(db, user_id)


def ensure_business_profile(
    db: Session,
    user_id: uuid.UUID,
    *,
    owner_name: str | None = None
) -> BusinessProfile:
    profile = crud.get_business_profile_by_user_id(db, user_id)
    if profile is not None:
        if owner_name and not profile.owner_name:
            profile.owner_name = owner_name
            db.commit()
            db.refresh(profile)
        return profile

    return crud.create_business_profile(db, user_id=user_id, owner_name=owner_name)
