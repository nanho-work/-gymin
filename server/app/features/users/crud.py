import uuid

from sqlalchemy.orm import Session

from app.features.users.model import User


def get_user(db: Session, user_id: uuid.UUID) -> User | None:
    return db.get(User, user_id)
