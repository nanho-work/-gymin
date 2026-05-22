import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.auth.dependencies import CurrentUser, require_business
from app.features.business.schema import BusinessProfileRead
from app.features.business.service import ensure_business_profile, get_business_profile_or_none


router = APIRouter(prefix="/business-profiles", tags=["business"])


@router.get("/me", response_model=BusinessProfileRead)
def read_my_business_profile(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_business)
) -> BusinessProfileRead:
    return ensure_business_profile(db, current_user.id, owner_name=current_user.display_name)


@router.get("/{profile_id}", response_model=BusinessProfileRead)
def read_business_profile(profile_id: uuid.UUID, db: Session = Depends(get_db)) -> BusinessProfileRead:
    profile = get_business_profile_or_none(db, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return profile
