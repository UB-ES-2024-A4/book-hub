""" Tests configuration module """
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select, delete

from app.core.database import engine, init_db, get_session
from app.main import app
from app.models import User

# Cuando los tests necesiten una session llamarán a esta fixture
@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        existing_user_ids = {user for user in session.execute(select(User.id)).scalars().unique()}
        print('Existing users A:', existing_user_ids)
        init_db(session)

        yield session

        # Erase users created during testing
        new_users = session.execute(select(User).filter(~User.id.in_(existing_user_ids))).scalars().unique().all()
        a = {user for user in session.execute(select(User.id)).scalars().unique()}
        print('All users:', a)
        print('New', new_users)
        for user in new_users:
            session.delete(user)

        session.commit()

# Cuando los tests necesiten un objeto cliente llamaran a esta fixture.
@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c

# Fixture to provide a test client and override get_session globally for this test file
@pytest.fixture(scope="module", autouse=True)
def override_get_session(db: Session) -> None:
    # Override FastAPI's get_session dependency to use the test session
    def _override_get_session():
        yield db

    # Apply the override globally for all tests in this module
    app.dependency_overrides[get_session] = _override_get_session

    # Yield to allow tests to run
    yield

    # Cleanup: Remove overrides after tests are done
    app.dependency_overrides = {}
