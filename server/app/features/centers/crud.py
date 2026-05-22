import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.business.model import BusinessProfile
from app.features.centers.model import Center
from app.features.centers.schema import CenterCreate, CenterUpdate


def list_centers(db: Session, params: PaginationParams) -> Page:
    statement = select(Center).where(Center.deleted_at.is_(None)).order_by(Center.created_at.desc())
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def list_centers_by_business_user_id(db: Session, user_id: uuid.UUID, params: PaginationParams) -> Page:
    statement = (
        select(Center)
        .join(BusinessProfile, BusinessProfile.id == Center.business_profile_id)
        .where(
            BusinessProfile.user_id == user_id,
            Center.deleted_at.is_(None)
        )
        .order_by(Center.created_at.desc())
    )
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def get_center(db: Session, center_id: uuid.UUID) -> Center | None:
    statement = select(Center).where(Center.id == center_id, Center.deleted_at.is_(None))
    return db.scalar(statement)


def get_center_for_business_user_id(db: Session, center_id: uuid.UUID, user_id: uuid.UUID) -> Center | None:
    statement = (
        select(Center)
        .join(BusinessProfile, BusinessProfile.id == Center.business_profile_id)
        .where(
            Center.id == center_id,
            BusinessProfile.user_id == user_id,
            Center.deleted_at.is_(None)
        )
    )
    return db.scalar(statement)


def create_center(db: Session, payload: CenterCreate, business_profile_id: uuid.UUID) -> Center:
    center = Center(**payload.model_dump(), business_profile_id=business_profile_id)
    db.add(center)
    db.commit()
    db.refresh(center)
    return center


def update_center(db: Session, center: Center, payload: CenterUpdate) -> Center:
    for field, value in payload.model_dump().items():
        setattr(center, field, value)

    db.commit()
    db.refresh(center)
    return center
