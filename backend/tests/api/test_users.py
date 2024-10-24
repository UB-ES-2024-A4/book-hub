from fastapi.testclient import TestClient

from app.models.user import User, UserCreate
from sqlmodel import Session, select
from app.core.config import settings
from app import crud

## TESTS FOR ENDPOINT CREATE
def test_create_user_length_username(
    client: TestClient, db: Session
) -> None:
    
    password = settings.PASSWORD_TEST_USER
    email = settings.EMAIL_TEST_USER
    first_name = settings.FIRST_NAME_TEST_USER
    last_name = settings.LAST_NAME_TEST_USER

    data = {"email": email, "username": 'a'*21, "first_name": first_name, "last_name": last_name, "password": password}
    r = client.post(
        f"/users/",
        json=data,
    )

    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

    data["username"] = 'a'
    r = client.post(
        f"/users/",
        json=data,
    )

    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'Username must contain at least 3 characters.'

def test_create_user_length_name(
    client: TestClient, db: Session
) -> None:
    username = settings.USERNAME_TEST_USER
    password = settings.PASSWORD_TEST_USER
    email = settings.EMAIL_TEST_USER
    first_name = settings.FIRST_NAME_TEST_USER
    last_name = settings.LAST_NAME_TEST_USER

    data = {"email": email, "username": username, "first_name": 'a'*21, "last_name": last_name, "password": password}
    r = client.post(
        f"/users/",
        json=data,
    )

    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

    data["first_name"] = first_name
    data["last_name"] = 'a'*21

    r = client.post(
        f"/users/",
        json=data,
    )

    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

def test_create_user_missing_name(
    client: TestClient, db: Session
) -> None:
    username = settings.USERNAME_TEST_USER
    password = settings.PASSWORD_TEST_USER
    email = settings.EMAIL_TEST_USER
    first_name = settings.FIRST_NAME_TEST_USER
    last_name = settings.LAST_NAME_TEST_USER

    data = {"email": email, "username": username, "last_name": last_name, "password": password}
    r = client.post(
        f"/users/",
        json=data,
    )

    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'First name and last name required.'

    data = {"email": email, "username": username, "first_name": first_name, "password": password}
    r = client.post(
        f"/users/",
        json=data,
    )

    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'First name and last name required.'

def test_create_user_length_pwd(
    client: TestClient, db: Session
) -> None:
    username = settings.USERNAME_TEST_USER
    email = settings.EMAIL_TEST_USER
    first_name = settings.FIRST_NAME_TEST_USER
    last_name = settings.LAST_NAME_TEST_USER

    data = {"email": email, "username": username, "first_name": first_name, "last_name": last_name, "password": 'a'}
    r = client.post(
        f"/users/",
        json=data,
    )

    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'Password must contain between 8 and 28 characters.'

    data["password"] = 'a'*29

    r = client.post(
        f"/users/",
        json=data,
    )

    created_user = r.json()
    assert r.status_code == 400
    assert created_user['detail'] == 'Password must contain between 8 and 28 characters.'

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

## TESTS FOR UPDATE ENDPOINT

## TESTS FOR DELETE ENDPOINT
def test_delete_user(
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

    user = crud.user.get_user_by_name(session=db, name=username)

    r = client.delete(
        f"/users/{user.id}"
    )

    assert r.status_code == 200
    deleted_user = r.json()
    assert deleted_user["message"] == "User deleted successfully"

def test_delete_user_not_found(
    client: TestClient, db: Session
) -> None:
    r = client.delete(
        f"/users/99999999",
    )
    
    assert r.status_code == 404
    assert r.json()["detail"] == "User not found."

