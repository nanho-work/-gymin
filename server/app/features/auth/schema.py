import uuid
from typing import Literal

from pydantic import BaseModel


class FirebaseLoginRequest(BaseModel):
    id_token: str
    role: Literal["trainer", "business"]


class AuthUserRead(BaseModel):
    id: uuid.UUID
    role: Literal["trainer", "business", "admin"]
    display_name: str
    email: str | None = None


class AuthSessionResponse(BaseModel):
    user: AuthUserRead
    is_new_user: bool = False
