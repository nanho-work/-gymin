import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.business.schema import BusinessProfileRead
from app.features.business.service import get_business_profile_or_none


router = APIRouter(prefix="/business-profiles", tags=["business"])


@router.get("/{profile_id}", response_model=BusinessProfileRead)
def read_business_profile(profile_id: uuid.UUID, db: Session = Depends(get_db)) -> BusinessProfileRead:
    profile = get_business_profile_or_none(db, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return profile
