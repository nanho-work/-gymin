import uuid
from typing import Literal

from pydantic import BaseModel


class SocialLoginMockRequest(BaseModel):
    provider: str
    provider_user_id: str
    role: str
    display_name: str
    provider_email: str | None = None


class SocialLoginMockResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class FirebaseLoginRequest(BaseModel):
    id_token: str
    role: Literal["trainer", "business"]


class FirebaseLoginResponse(BaseModel):
    user_id: uuid.UUID
    provider: Literal["google"] = "google"
    role: Literal["trainer", "business"]
    display_name: str
    email: str | None = None
    is_new_user: bool
