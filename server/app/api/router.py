from fastapi import APIRouter

from app.features.applications.router import router as applications_router
from app.features.auth.router import router as auth_router
from app.features.business.router import router as business_router
from app.features.centers.router import router as centers_router
from app.features.jobs.router import router as jobs_router
from app.features.media.router import router as media_router
from app.features.stats.router import router as stats_router
from app.features.trainers.router import router as trainers_router
from app.features.users.router import router as users_router


api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(business_router)
api_router.include_router(centers_router)
api_router.include_router(trainers_router)
api_router.include_router(jobs_router)
api_router.include_router(applications_router)
api_router.include_router(media_router)
api_router.include_router(stats_router)
