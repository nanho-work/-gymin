import uuid

from sqlalchemy.orm import Session

from app.features.business import crud
from app.features.business.model import BusinessProfile


def get_business_profile_or_none(db: Session, profile_id: uuid.UUID) -> BusinessProfile | None:
    return crud.get_business_profile(db, profile_id)
