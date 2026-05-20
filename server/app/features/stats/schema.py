from pydantic import BaseModel


class PlatformStatsRead(BaseModel):
    total_members: int
    trainer_members: int
    business_members: int
    trainer_profiles: int
    centers: int
    verified_centers: int
    total_job_posts: int
    open_job_posts: int
    submitted_applications: int
