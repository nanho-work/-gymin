import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Center(Base):
    __tablename__ = "centers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("business_profiles.id", ondelete="RESTRICT"))
    name: Mapped[str] = mapped_column(String(120))
    sido: Mapped[str] = mapped_column(String(40))
    sigungu: Mapped[str] = mapped_column(String(60))
    detail_address: Mapped[str] = mapped_column(String(255))
    industry: Mapped[str] = mapped_column(String(40))
    operation_type: Mapped[str | None] = mapped_column(String(255))
    introduction: Mapped[str | None] = mapped_column(Text)
    homepage_url: Mapped[str | None] = mapped_column(String(500))
    instagram_url: Mapped[str | None] = mapped_column(String(500))
    youtube_url: Mapped[str | None] = mapped_column(String(500))
    verification_status: Mapped[str] = mapped_column(String(30), default="not_requested")
    status: Mapped[str] = mapped_column(String(30), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    business_profile = relationship("BusinessProfile", back_populates="centers")
    job_posts = relationship("JobPost", back_populates="center")
