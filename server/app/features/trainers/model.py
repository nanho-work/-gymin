import uuid
from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, SmallInteger, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TrainerProfile(Base):
    __tablename__ = "trainer_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    name: Mapped[str | None] = mapped_column(String(80))
    birth_date: Mapped[date | None] = mapped_column(Date)
    age: Mapped[int | None] = mapped_column(SmallInteger)
    gender: Mapped[str | None] = mapped_column(String(20))
    phone: Mapped[str | None] = mapped_column(String(30))
    residence_sido: Mapped[str | None] = mapped_column(String(40))
    residence_sigungu: Mapped[str | None] = mapped_column(String(60))
    desired_area_text: Mapped[str | None] = mapped_column(String(255))
    headline: Mapped[str | None] = mapped_column(String(160))
    experience_years: Mapped[int | None] = mapped_column(SmallInteger)
    work_type: Mapped[str | None] = mapped_column(String(80))
    availability: Mapped[str | None] = mapped_column(String(255))
    summary: Mapped[str | None] = mapped_column(Text)
    profile_status: Mapped[str] = mapped_column(String(30), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    specialties = relationship("TrainerSpecialty", cascade="all, delete-orphan", back_populates="trainer_profile")
    work_experiences = relationship("TrainerWorkExperience", cascade="all, delete-orphan", back_populates="trainer_profile")
    credentials = relationship("TrainerCredential", cascade="all, delete-orphan", back_populates="trainer_profile")
    portfolio_links = relationship("TrainerPortfolioLink", cascade="all, delete-orphan", back_populates="trainer_profile")


class TrainerSpecialty(Base):
    __tablename__ = "trainer_specialties"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trainer_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("trainer_profiles.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(80))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    trainer_profile = relationship("TrainerProfile", back_populates="specialties")


class TrainerWorkExperience(Base):
    __tablename__ = "trainer_work_experiences"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trainer_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("trainer_profiles.id", ondelete="CASCADE"))
    center_name: Mapped[str] = mapped_column(String(120))
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    period_text: Mapped[str | None] = mapped_column(String(80))
    role_description: Mapped[str] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    trainer_profile = relationship("TrainerProfile", back_populates="work_experiences")


class TrainerCredential(Base):
    __tablename__ = "trainer_credentials"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trainer_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("trainer_profiles.id", ondelete="CASCADE"))
    credential_type: Mapped[str] = mapped_column(String(40), default="certificate")
    title: Mapped[str] = mapped_column(String(160))
    issued_by: Mapped[str | None] = mapped_column(String(160))
    issued_at: Mapped[date | None] = mapped_column(Date)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    trainer_profile = relationship("TrainerProfile", back_populates="credentials")


class TrainerPortfolioLink(Base):
    __tablename__ = "trainer_portfolio_links"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trainer_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("trainer_profiles.id", ondelete="CASCADE"))
    label: Mapped[str] = mapped_column(String(80))
    url: Mapped[str] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    trainer_profile = relationship("TrainerProfile", back_populates="portfolio_links")
