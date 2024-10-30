from fastapi.testclient import TestClient

from app.models.user import User, UserCreate
from sqlmodel import Session, select, text
from app.core.config import settings
from app import crud

username = settings.USERNAME_TEST_USER
password = settings.PASSWORD_TEST_USER
email = settings.EMAIL_TEST_USER
first_name = settings.FIRST_NAME_TEST_USER
last_name = settings.LAST_NAME_TEST_USER

## TESTS FOR ENDPOINT CREATE
def test_create_user_length_username(
    client: TestClient, db: Session
) -> None:
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
def test_update_user_name_length(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='test_put_name', username='test_put_name', first_name=last_name, last_name=first_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    user = crud.user.get_user_by_name(session=db, name='test_put_name')

    data = {"username": user.username, 'first_name': 'a'*21, "last_name": user.last_name}

    r = client.put(
        f"users/{user.id}",
        json=data
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

    data = {"username": user.username, 'first_name': user.first_name, "last_name": 'a'*21}

    r = client.put(
        f"users/{user.id}",
        json=data
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

def test_update_user_username_length(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='test_put_usrname', username='test_put_usrname', first_name=last_name, last_name=first_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    user = crud.user.get_user_by_name(session=db, name='test_put_usrname')

    data = {"username": 'ab', 'first_name': user.first_name, "last_name": user.last_name}

    r = client.put(
        f"users/{user.id}",
        json=data
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username must contain at least 3 characters.'

    data = {"username": 'a'*21, 'first_name': user.first_name, "last_name": user.last_name}

    r = client.put(
        f"users/{user.id}",
        json=data
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

def test_update_user_existing_username(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='test_put_usrname1', username='test_put_usrname1', first_name=last_name, last_name=first_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    user_in = UserCreate(email='test_put_usrname2', username='test_put_usrname2', first_name=last_name, last_name=first_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    user = crud.user.get_user_by_name(session=db, name='test_put_usrname2')

    data = {"username": 'test_put_usrname1', 'first_name': user.first_name, "last_name": user.last_name}

    r = client.put(
        f"users/{user.id}",
        json=data
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'This username is already in use.'

def test_update_all_fields(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='test_put_all', username='test_put_all', first_name=last_name, last_name=first_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    user = crud.user.get_user_by_name(session=db, name='test_put_all')

    data = {"username": 'test_put_usr', 'first_name': 'test_put_first', "last_name": 'test_put_last'}

    r = client.put(
        f"users/{user.id}",
        json=data
    )

    updated_user = r.json()
    assert r.status_code == 200
    assert updated_user['username'] == 'test_put_usr'
    assert updated_user['first_name'] == 'test_put_first'
    assert updated_user['last_name'] == 'test_put_last'

def test_update_user_not_found(
    client: TestClient, db: Session
) -> None:
    data = {"email": email, "username": username, "first_name": first_name, "last_name": last_name}

    r = client.put(
        f"users/999999",
        json=data
    )

    updated_user = r.json()
    assert r.status_code == 404
    assert updated_user['detail'] == 'User not found.'

## TESTS FOR DELETE ENDPOINT
def test_delete_user(
    client: TestClient, db: Session
) -> None:
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

def test_get_user_not_found_by_name(
    client: TestClient, db: Session
) -> None:
    r = client.get(
        f"/users/name/aaaaaaaaaaaaaaaaaaaaa",
    )
    
    assert r.status_code == 404
    assert r.json()["detail"] == "User not found."

def test_get_user_not_found_by_id(
    client: TestClient, db: Session
) -> None:
    r = client.get(
        f"/users/99999999",
    )
    
    assert r.status_code == 404
    assert r.json()["detail"] == "User not found."

def test_get_all_users(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='test', username='test', first_name='test', last_name='test', password='test_test')
    crud.user.create_user(session=db, user_create=user_in)

    user_in2 = UserCreate(email='test2', username='test2', first_name='test2', last_name='test2', password='test_test2')
    crud.user.create_user(session=db, user_create=user_in2)

    r = client.get(
        "/users/all"
    )

    all_users = r.json()

    assert len(all_users) > 1
    for item in all_users:
        assert "username" in item
        assert "email" in item
        assert "first_name" in item
        assert "last_name" in item

def test_get_user_by_id(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='test_id', username='test_id', first_name=first_name, last_name=last_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    user = crud.user.get_user_by_name(session=db, name='test_id')

    r = client.get(
        f'/users/{user.id}'
    )

    assert r.status_code == 200
    retrieved_user = r.json()
    assert retrieved_user
    assert user.email == retrieved_user["email"]
    assert user.username == retrieved_user["username"]
    assert user.first_name == retrieved_user["first_name"]
    assert user.last_name == retrieved_user["last_name"]

def test_get_user_by_name(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='testName', username='testName', first_name=first_name, last_name=last_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    user = crud.user.get_user_by_name(session=db, name='testName')

    r = client.get(
        f'/users/name/{user.username}'
    )

    assert r.status_code == 200
    retrieved_user = r.json()
    assert retrieved_user
    assert user.email == retrieved_user["email"]
    assert user.username == retrieved_user["username"]
    assert user.first_name == retrieved_user["first_name"]
    assert user.last_name == retrieved_user["last_name"]

def test_get_users_empty(
    client: TestClient, db: Session
) -> None:
    try:
        db.execute(text('DELETE FROM user'))

        r = client.get(
            "/users/all"
        )

        all_users = r.json()

        assert r.status_code == 200
        assert all_users == []
    finally:
        db.rollback()