""" Tests configuration module """
from collections.abc import Generator
from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select, delete

from .utils import get_user_token_headers
from app.core.database import engine, init_db, get_session
from app.main import app
from app.models import User, Post, Book, Filter, Comment, Followers

# Cuando los tests necesiten una session llamarán a esta fixture
@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        existing_user_ids = {user for user in session.execute(select(User.id)).scalars().unique()}
        existing_post_ids = {post for post in session.execute(select(Post.id)).scalars().unique()}
        existing_book_ids = {book for book in session.execute(select(Book.id)).scalars().unique()}
        existing_filters_ids = {filter_ for filter_ in session.execute(select(Filter.id)).scalars().unique()}

        init_db(session)

        yield session

        # Erase users created during testing
        new_users = session.execute(select(User).filter(~User.id.in_(existing_user_ids))).scalars().unique().all()

        for user in new_users:
            session.delete(user)

        # Erase posts created during testing
        new_posts = session.execute(select(Post).filter(~Post.id.in_(existing_post_ids))).scalars().unique().all()

        for post in new_posts:
            session.delete(post)

        # Erase books created during testing
        new_books = session.execute(select(Book).filter(~Book.id.in_(existing_book_ids))).scalars().unique().all()

        for book in new_books:
            session.delete(book)

        session.commit()

        # Erase filters created during testing
        new_filters = session.execute(select(Filter).filter(~Filter.id.in_(existing_filters_ids))).scalars().unique().all()

        for filter_ in new_filters:
            session.delete(filter_)

        session.commit()

# Cuando los tests necesiten un objeto cliente llamaran a esta fixture.
@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c

# Fixture para hacer un override de la función get_session y compartir la sesión
@pytest.fixture(scope="module", autouse=True)
def override_get_session(db: Session) -> None:
    # Override FastAPI's get_session dependency to use the test session
    def _override_get_session():
        yield db

    # El override se aplica en todos los tests
    app.dependency_overrides[get_session] = _override_get_session

    yield

    # Cuando se acaban los tests eliminamos el override
    app.dependency_overrides = {}

@pytest.fixture(scope="module")
def logged_user_token_headers(client: TestClient) -> dict[str, str]:
    return get_user_token_headers(client)
