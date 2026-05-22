import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_post_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("job_posts.id", ondelete="CASCADE"))
    trainer_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("trainer_profiles.id", ondelete="RESTRICT"))
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="submitted")
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    job_post = relationship("JobPost")
    trainer_profile = relationship("TrainerProfile")
