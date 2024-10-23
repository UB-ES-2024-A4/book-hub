from fastapi.testclient import TestClient

from app.models.user import User, UserCreate
from sqlmodel import Session, select
from app.core.config import settings
from app import crud


def test_create_user_new_email(
    client: TestClient, db: Session
) -> None:
    username = settings.USERNAME_TEST_USER
    password = settings.PASSWORD_TEST_USER
    email = settings.EMAIL_TEST_USER
    first_name = settings.FIRST_NAME_TEST_USER
    last_name = settings.LAST_NAME_TEST_USER

    data = {"email": email,"username": username, "first_name": first_name, "last_name": last_name, "password": password}
    r = client.post(
        f"/users/",
        json=data,
    )
    assert 200 <= r.status_code < 300
    created_user = r.json()
    user = crud.user.get_user_by_name(session=db, name=username)
    assert user
    assert user.email == created_user["email"]

def test_create_user_existing_email(
    client: TestClient, db: Session
) -> None:
    username = settings.USERNAME_TEST_USER
    password = settings.PASSWORD_TEST_USER
    email = settings.EMAIL_TEST_USER
    first_name = settings.FIRST_NAME_TEST_USER
    last_name = settings.LAST_NAME_TEST_USER

    data = {"email": email, "username": username, "first_name": first_name, "last_name": last_name, "password": password}
    r = client.post(
        f"/users/",
        json=data,
    )

    r = client.post(
        f"/users/",
        json=data,
    )
    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'This email is already in use.'

def test_create_user_existing_username(
    client: TestClient, db: Session
) -> None:
    username = settings.USERNAME_TEST_USER
    password = settings.PASSWORD_TEST_USER
    email = settings.EMAIL_TEST_USER
    first_name = settings.FIRST_NAME_TEST_USER
    last_name = settings.LAST_NAME_TEST_USER

    data = {"email": email, "username": username, "first_name": first_name, "last_name": last_name, "password": password}
    r = client.post(
        f"/users/",
        json=data,
    )

    data['email'] = 'email2'

    r = client.post(
        f"/users/",
        json=data,
    )
    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'This username is already in use.'
