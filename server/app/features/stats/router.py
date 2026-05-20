from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.stats.schema import PlatformStatsRead
from app.features.stats.service import get_platform_stats


router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary", response_model=PlatformStatsRead)
def read_platform_stats(db: Session = Depends(get_db)) -> PlatformStatsRead:
    return get_platform_stats(db)
