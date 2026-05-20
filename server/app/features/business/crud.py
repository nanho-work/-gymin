import uuid

from sqlalchemy.orm import Session

from app.features.business.model import BusinessProfile


def get_business_profile(db: Session, profile_id: uuid.UUID) -> BusinessProfile | None:
    return db.get(BusinessProfile, profile_id)
