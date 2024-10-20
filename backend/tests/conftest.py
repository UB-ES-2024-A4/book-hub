""" Tests configuration module """
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.database import engine, init_db
from app.main import app

# Cuando los tests necesiten una session llamarán a esta fixture
@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        init_db(session)

        yield session

# Cuando los tests necesiten un objeto cliente llamaran a esta fixture.
@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c
