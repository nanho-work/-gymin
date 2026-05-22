import uuid
from datetime import datetime, timezone

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.common.pagination import PaginationParams, Page, build_page, paginate_statement
from app.features.applications.model import JobApplication
from app.features.business.model import BusinessProfile
from app.features.centers.model import Center
from app.features.jobs.model import JobPost
from app.features.jobs.schema import JobPostCreate, JobPostSearchParams, OwnerJobPostRead


INDUSTRY_SEARCH_KEYWORDS: dict[str, tuple[str, ...]] = {
    "health_pt": ("헬스", "pt", "피티", "퍼스널", "트레이닝"),
    "pilates": ("필라테스",),
    "yoga": ("요가",),
    "crossfit": ("크로스핏",),
    "rehab": ("재활", "교정"),
    "mixed": ("복합", "종합"),
    "etc": ("기타",)
}


def list_jobs(db: Session, params: PaginationParams, search: JobPostSearchParams | None = None) -> Page:
    statement = (
        select(JobPost)
        .join(Center, Center.id == JobPost.center_id)
        .options(joinedload(JobPost.center))
        .where(
            JobPost.deleted_at.is_(None),
            JobPost.status == "open",
            Center.deleted_at.is_(None)
        )
    )
    statement = apply_job_search(statement, search)
    statement = statement.order_by(JobPost.published_at.desc().nullslast(), JobPost.created_at.desc())
    items, total = paginate_statement(db, statement, params)
    return build_page(items, total, params)


def apply_job_search(statement, search: JobPostSearchParams | None):
    if search is None:
        return statement

    if search.sido:
        statement = statement.where(Center.sido == search.sido)
    if search.sigungu:
        statement = statement.where(Center.sigungu == search.sigungu)
    if search.industry:
        statement = statement.where(Center.industry == search.industry)

    keyword = (search.q or "").strip()
    if keyword:
        pattern = f"%{escape_like(keyword)}%"
        industry_codes = find_industry_codes(keyword)
        search_conditions = [
            JobPost.title.ilike(pattern, escape="\\"),
            Center.name.ilike(pattern, escape="\\"),
            Center.sido.ilike(pattern, escape="\\"),
            Center.sigungu.ilike(pattern, escape="\\")
        ]
        if industry_codes:
            search_conditions.append(Center.industry.in_(industry_codes))
        statement = statement.where(or_(*search_conditions))

    return statement


def escape_like(value: str) -> str:
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def find_industry_codes(keyword: str) -> list[str]:
    normalized_keyword = keyword.lower()
    return [
        code
        for code, keywords in INDUSTRY_SEARCH_KEYWORDS.items()
        if code in normalized_keyword or any(item.lower() in normalized_keyword for item in keywords)
    ]


def list_jobs_by_business_user_id(db: Session, user_id: uuid.UUID, params: PaginationParams) -> Page:
    statement = (
        select(JobPost)
        .options(joinedload(JobPost.center))
        .join(BusinessProfile, BusinessProfile.id == JobPost.business_profile_id)
        .where(
            BusinessProfile.user_id == user_id,
            JobPost.deleted_at.is_(None)
        )
        .order_by(JobPost.created_at.desc())
    )
    jobs, total = paginate_statement(db, statement, params)
    counts = get_application_counts_by_job_ids(db, [job.id for job in jobs])
    items = []

    for job in jobs:
        applicant_count, reviewed_applicant_count = counts.get(job.id, (0, 0))
        items.append(
            OwnerJobPostRead.model_validate(job).model_copy(
                update={
                    "applicant_count": applicant_count,
                    "reviewed_applicant_count": reviewed_applicant_count
                }
            )
        )

    return build_page(items, total, params)


def get_application_counts_by_job_ids(db: Session, job_ids: list[uuid.UUID]) -> dict[uuid.UUID, tuple[int, int]]:
    if not job_ids:
        return {}

    statement = (
        select(
            JobApplication.job_post_id,
            func.count(JobApplication.id),
            func.count(JobApplication.reviewed_at)
        )
        .where(JobApplication.job_post_id.in_(job_ids))
        .group_by(JobApplication.job_post_id)
    )
    return {
        job_id: (applicant_count, reviewed_count)
        for job_id, applicant_count, reviewed_count in db.execute(statement).all()
    }


def get_job(db: Session, job_id: uuid.UUID) -> JobPost | None:
    statement = (
        select(JobPost)
        .options(joinedload(JobPost.center))
        .where(JobPost.id == job_id, JobPost.deleted_at.is_(None))
    )
    return db.scalar(statement)


def get_job_for_business_user_id(db: Session, job_id: uuid.UUID, user_id: uuid.UUID) -> JobPost | None:
    statement = (
        select(JobPost)
        .options(joinedload(JobPost.center))
        .join(BusinessProfile, BusinessProfile.id == JobPost.business_profile_id)
        .where(
            JobPost.id == job_id,
            BusinessProfile.user_id == user_id,
            JobPost.deleted_at.is_(None)
        )
    )
    return db.scalar(statement)


def create_job(db: Session, payload: JobPostCreate, business_profile_id: uuid.UUID) -> JobPost:
    now = datetime.now(timezone.utc)
    job = JobPost(
        **payload.model_dump(),
        business_profile_id=business_profile_id,
        status="open",
        published_at=now,
        updated_at=now
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def close_job(db: Session, job: JobPost) -> JobPost:
    now = datetime.now(timezone.utc)
    job.status = "closed"
    job.closed_at = now
    job.updated_at = now
    db.commit()
    db.refresh(job)
    return job
