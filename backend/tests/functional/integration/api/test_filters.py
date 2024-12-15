from fastapi.testclient import TestClient

from app.models import Filter
from sqlmodel import Session, select, text
from datetime import datetime
from app.core.config import settings
from app import crud

def test_get_filters(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    r = client.get(
        '/filters/all'
    )

    filters = r.json()

    for item in filters:
        assert item['name']
        assert item['id']
