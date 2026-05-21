import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.common.pagination import Page, PaginationParams, get_pagination_params
from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, require_business
from app.features.centers.schema import CenterCreate, CenterRead
from app.features.centers.service import create_center, get_center, list_centers


router = APIRouter(prefix="/centers", tags=["centers"])


@router.get("", response_model=Page[CenterRead])
def read_centers(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db)
) -> Page[CenterRead]:
    return list_centers(db, params=pagination)


@router.get("/{center_id}", response_model=CenterRead)
def read_center(center_id: uuid.UUID, db: Session = Depends(get_db)) -> CenterRead:
    center = get_center(db, center_id)
    if center is None:
        raise HTTPException(status_code=404, detail="센터를 찾을 수 없습니다.")
    return center


@router.post("", response_model=CenterRead, status_code=201)
def create_center_endpoint(
    payload: CenterCreate,
    db: Session = Depends(get_db),
    _current_user: CurrentUser = Depends(require_business)
) -> CenterRead:
    return create_center(db, payload)
