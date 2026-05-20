import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.users.schema import UserRead
from app.features.users.service import get_user_or_none


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: uuid.UUID, db: Session = Depends(get_db)) -> UserRead:
    user = get_user_or_none(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
