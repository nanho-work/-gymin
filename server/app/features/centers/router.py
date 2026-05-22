import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.common.pagination import Page, PaginationParams, get_pagination_params
from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, require_business
from app.features.business.service import ensure_business_profile
from app.features.centers.schema import CenterCreate, CenterRead, CenterUpdate
from app.features.centers.service import (
    create_center,
    get_center,
    get_my_center,
    list_centers,
    list_my_centers,
    to_center_read,
    update_center
)


router = APIRouter(prefix="/centers", tags=["centers"])


@router.get("", response_model=Page[CenterRead])
def read_centers(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db)
) -> Page[CenterRead]:
    return list_centers(db, params=pagination)


@router.get("/me", response_model=Page[CenterRead])
def read_my_centers(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> Page[CenterRead]:
    return list_my_centers(db, current_user.id, params=pagination)


@router.get("/{center_id}", response_model=CenterRead)
def read_center(center_id: uuid.UUID, db: Session = Depends(get_db)) -> CenterRead:
    center = get_center(db, center_id)
    if center is None:
        raise HTTPException(status_code=404, detail="센터를 찾을 수 없습니다.")
    return to_center_read(db, center)


@router.post("", response_model=CenterRead, status_code=201)
def create_center_endpoint(
    payload: CenterCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> CenterRead:
    profile = ensure_business_profile(db, current_user.id, owner_name=current_user.display_name)
    center = create_center(db, payload, profile.id)
    return to_center_read(db, center)


@router.put("/{center_id}", response_model=CenterRead)
def update_center_endpoint(
    center_id: uuid.UUID,
    payload: CenterUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> CenterRead:
    center = get_my_center(db, center_id, current_user.id)
    if center is None:
        raise HTTPException(status_code=404, detail="센터를 찾을 수 없습니다.")

    updated_center = update_center(db, center, payload)
    return to_center_read(db, updated_center)
