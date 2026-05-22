import uuid

from sqlalchemy.orm import Session

from app.common.pagination import PaginationParams, Page
from app.features.centers import crud
from app.features.centers.model import Center
from app.features.centers.schema import CenterCreate, CenterUpdate


def list_centers(db: Session, params: PaginationParams) -> Page:
    return crud.list_centers(db, params=params)


def list_my_centers(db: Session, user_id: uuid.UUID, params: PaginationParams) -> Page:
    return crud.list_centers_by_business_user_id(db, user_id, params=params)


def get_center(db: Session, center_id: uuid.UUID) -> Center | None:
    return crud.get_center(db, center_id)


def get_my_center(db: Session, center_id: uuid.UUID, user_id: uuid.UUID) -> Center | None:
    return crud.get_center_for_business_user_id(db, center_id, user_id)


def create_center(db: Session, payload: CenterCreate, business_profile_id: uuid.UUID) -> Center:
    return crud.create_center(db, payload, business_profile_id)


def update_center(db: Session, center: Center, payload: CenterUpdate) -> Center:
    return crud.update_center(db, center, payload)
