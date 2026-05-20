from sqlalchemy.orm import Session

from app.features.stats import crud
from app.features.stats.schema import PlatformStatsRead


def get_platform_stats(db: Session) -> PlatformStatsRead:
    return PlatformStatsRead(
        total_members=crud.count_total_members(db),
        trainer_members=crud.count_members_by_role(db, "trainer"),
        business_members=crud.count_members_by_role(db, "business"),
        trainer_profiles=crud.count_trainer_profiles(db),
        centers=crud.count_centers(db),
        verified_centers=crud.count_verified_centers(db),
        total_job_posts=crud.count_total_job_posts(db),
        open_job_posts=crud.count_open_job_posts(db),
        submitted_applications=crud.count_submitted_applications(db)
    )
