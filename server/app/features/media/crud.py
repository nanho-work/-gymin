import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.features.media.model import MediaFile


def list_entity_media(
    db: Session,
    *,
    entity_type: str,
    entity_id: uuid.UUID,
    purpose: str | None = None
) -> list[MediaFile]:
    statement = (
        select(MediaFile)
        .options(selectinload(MediaFile.variants))
        .where(
            MediaFile.entity_type == entity_type,
            MediaFile.entity_id == entity_id,
            MediaFile.deleted_at.is_(None)
        )
        .order_by(MediaFile.sort_order.asc(), MediaFile.created_at.asc())
    )

    if purpose is not None:
        statement = statement.where(MediaFile.purpose == purpose)

    return list(db.scalars(statement).all())
