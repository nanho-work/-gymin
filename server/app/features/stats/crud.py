from sqlalchemy import select
from sqlalchemy.orm import Session

from app.common.pagination import count_statement
from app.features.applications.model import JobApplication
from app.features.auth.model import UserRole
from app.features.centers.model import Center
from app.features.jobs.model import JobPost
from app.features.trainers.model import TrainerProfile
from app.features.users.model import User


def count_total_members(db: Session) -> int:
    return count_statement(db, select(User.id).where(User.deleted_at.is_(None)))


def count_members_by_role(db: Session, role: str) -> int:
    return count_statement(
        db,
        select(UserRole.id).join(User).where(
            User.deleted_at.is_(None),
            UserRole.role == role,
            UserRole.status == "active"
        )
    )


def count_trainer_profiles(db: Session) -> int:
    return count_statement(
        db,
        select(TrainerProfile.id).where(
            TrainerProfile.deleted_at.is_(None),
            TrainerProfile.profile_status != "deleted"
        )
    )


def count_centers(db: Session) -> int:
    return count_statement(
        db,
        select(Center.id).where(
            Center.deleted_at.is_(None),
            Center.status != "deleted"
        )
    )


def count_verified_centers(db: Session) -> int:
    return count_statement(
        db,
        select(Center.id).where(
            Center.deleted_at.is_(None),
            Center.status != "deleted",
            Center.verification_status == "verified"
        )
    )


def count_total_job_posts(db: Session) -> int:
    return count_statement(
        db,
        select(JobPost.id).where(
            JobPost.deleted_at.is_(None),
            JobPost.status != "deleted"
        )
    )


def count_open_job_posts(db: Session) -> int:
    return count_statement(
        db,
        select(JobPost.id).where(
            JobPost.deleted_at.is_(None),
            JobPost.status == "open"
        )
    )


def count_submitted_applications(db: Session) -> int:
    return count_statement(
        db,
        select(JobApplication.id).where(JobApplication.status == "submitted")
    )
