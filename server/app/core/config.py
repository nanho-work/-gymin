from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "GymIn API"
    app_env: str = "local"
    api_prefix: str = "/api"
    cors_origins: str = "http://localhost:3000"

    database_url: str

    aws_region: str = "ap-northeast-2"
    s3_bucket_name: str
    s3_presigned_url_expires_seconds: int = 300

    firebase_project_id: str | None = None
    firebase_credentials_file: str | None = None

    jwt_secret_key: str | None = None
    jwt_algorithm: str = "HS256"
    auth_cookie_name: str = "gymin_session"
    auth_cookie_max_age_seconds: int = 60 * 60 * 24 * 14
    auth_cookie_secure: bool | None = None

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def should_use_secure_auth_cookie(self) -> bool:
        if self.auth_cookie_secure is not None:
            return self.auth_cookie_secure
        return self.app_env not in ("local", "development", "test")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
