from functools import lru_cache

import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials

from app.core.config import get_settings


class FirebaseAuthError(Exception):
    pass


@lru_cache
def initialize_firebase_admin() -> firebase_admin.App:
    settings = get_settings()

    try:
        return firebase_admin.get_app()
    except ValueError:
        pass

    options = {"projectId": settings.firebase_project_id} if settings.firebase_project_id else None
    if settings.firebase_credentials_file:
        credential = credentials.Certificate(settings.firebase_credentials_file)
        return firebase_admin.initialize_app(credential, options=options)

    return firebase_admin.initialize_app(options=options)


def verify_firebase_id_token(id_token: str) -> dict:
    initialize_firebase_admin()
    try:
        return firebase_auth.verify_id_token(id_token)
    except Exception as exc:
        raise FirebaseAuthError("Firebase ID token verification failed") from exc
