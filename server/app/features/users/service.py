import uuid

from sqlalchemy.orm import Session

from app.features.users import crud
from app.features.users.model import User


def get_user_or_none(db: Session, user_id: uuid.UUID) -> User | None:
    return crud.get_user(db, user_id)
