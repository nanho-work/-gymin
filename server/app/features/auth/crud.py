"""Auth persistence helpers will live here when real OAuth is connected."""
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.features.auth.model import SocialAccount, UserRole
from app.features.users.model import User


def get_social_account(
    db: Session,
    provider: str,
    provider_user_id: str,
    role: str
) -> SocialAccount | None:
    statement = select(SocialAccount).where(
        SocialAccount.provider == provider,
        SocialAccount.provider_user_id == provider_user_id,
        SocialAccount.role == role
    )
    return db.scalars(statement).first()


def create_user_with_social_account(
    db: Session,
    *,
    display_name: str,
    email: str | None,
    provider: str,
    provider_user_id: str,
    role: str
) -> tuple[User, bool]:
    user = User(
        display_name=display_name,
        email=email,
        last_login_at=datetime.now(timezone.utc)
    )
    db.add(user)
    db.flush()

    db.add(UserRole(user_id=user.id, role=role))
    db.add(
        SocialAccount(
            user_id=user.id,
            role=role,
            provider=provider,
            provider_user_id=provider_user_id,
            provider_email=email
        )
    )
    db.commit()
    db.refresh(user)
    return user, True


def touch_social_login(db: Session, social_account: SocialAccount, email: str | None) -> tuple[User, bool]:
    user = social_account.user
    user.email = email or user.email
    user.last_login_at = datetime.now(timezone.utc)
    social_account.provider_email = email or social_account.provider_email
    db.commit()
    db.refresh(user)
    return user, False
