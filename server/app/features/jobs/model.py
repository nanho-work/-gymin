import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class JobPost(Base):
    __tablename__ = "job_posts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    center_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("centers.id", ondelete="RESTRICT"))
    business_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("business_profiles.id", ondelete="RESTRICT"))
    title: Mapped[str] = mapped_column(String(160))
    job_role: Mapped[str] = mapped_column(String(60))
    employment_type: Mapped[str] = mapped_column(String(60))
    start_date_text: Mapped[str | None] = mapped_column(String(120))
    work_days: Mapped[str | None] = mapped_column(String(160))
    work_hours: Mapped[str | None] = mapped_column(String(160))
    rest_time: Mapped[str | None] = mapped_column(String(160))
    base_pay: Mapped[str | None] = mapped_column(String(160))
    insurance_type: Mapped[str | None] = mapped_column(String(60))
    incentive: Mapped[str | None] = mapped_column(String(255))
    settlement_type: Mapped[str | None] = mapped_column(String(255))
    sales_pressure: Mapped[str | None] = mapped_column(String(60))
    member_handover: Mapped[str | None] = mapped_column(String(60))
    vacation: Mapped[str | None] = mapped_column(String(160))
    support_detail: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="draft")
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    center = relationship("Center", back_populates="job_posts")
