from fastapi.testclient import TestClient

from app.models.user import User, UserCreate
from sqlmodel import Session, select, text
from app.core.config import settings
from app import crud
from app.core.security import create_access_token

from datetime import timedelta

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
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user = crud.user.get_user_by_name(session=db, name='TEST_NAME')

    data = {"username": user.username, 'first_name': 'a'*21, "last_name": user.last_name}

    r = client.put(
        f"users/{user.id}",
        json=data,
        headers=logged_user_token_headers
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

    data = {"username": user.username, 'first_name': user.first_name, "last_name": 'a'*21}

    r = client.put(
        f"users/{user.id}",
        json=data,
        headers=logged_user_token_headers
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

def test_update_user_username_length(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user = crud.user.get_user_by_name(session=db, name='TEST_NAME')

    data = {"username": 'ab', 'first_name': user.first_name, "last_name": user.last_name}

    r = client.put(
        f"users/{user.id}",
        json=data,
        headers=logged_user_token_headers,
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username must contain at least 3 characters.'

    data = {"username": 'a'*21, 'first_name': user.first_name, "last_name": user.last_name}

    r = client.put(
        f"users/{user.id}",
        json=data,
        headers=logged_user_token_headers
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username, first name and last name must contain at most 20 characters.'

def test_update_user_existing_username(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_in = UserCreate(email='test_put_usrname1', username='test_put_usrname1', first_name=last_name, last_name=first_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    user = crud.user.get_user_by_name(session=db, name='TEST_NAME')

    data = {"username": 'test_put_usrname1', 'first_name': user.first_name, "last_name": user.last_name}

    r = client.put(
        f"users/{user.id}",
        json=data,
        headers=logged_user_token_headers,
    )

    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'This username is already in use.'

def test_update_all_fields(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user = crud.user.get_user_by_name(session=db, name='TEST_NAME')

    data = {"username": 'TEST_NAME', 'first_name': 'test_put_first', "last_name": 'test_put_last'}

    r = client.put(
        f"users/{user.id}",
        json=data,
        headers=logged_user_token_headers,
    )

    updated_user = r.json()
    assert r.status_code == 200
    assert updated_user['username'] == 'TEST_NAME'
    assert updated_user['first_name'] == 'test_put_first'
    assert updated_user['last_name'] == 'test_put_last'

def test_update_user_not_found(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    data = {"email": email, "username": username, "first_name": first_name, "last_name": last_name}

    r = client.put(
        f"users/999999",
        headers=logged_user_token_headers,
        json=data
    )

    updated_user = r.json()
    assert r.status_code == 404
    assert updated_user['detail'] == 'User not found.'

def test_update_user_not_logged(
    client: TestClient, db: Session
) -> None:
    user = crud.user.get_user_by_name(session=db, name='TEST_NAME')

    data = {"username": 'TEST_NAME', 'first_name': 'test_put_first', "last_name": 'test_put_last'}

    r = client.put(
        f"users/{user.id}",
        json=data,
        headers={},
    )

    updated_user = r.json()
    assert r.status_code == 401
    assert updated_user["detail"] == "Not authenticated"


def test_update_username_whitespaces(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user = crud.user.get_user_by_name(session=db, name='TEST_NAME')

    data = {"username": 'User with whitespaces'}

    r = client.put(
        f"users/{user.id}",
        json=data,
        headers=logged_user_token_headers,
    )
    
    updated_user = r.json()
    assert r.status_code == 400
    assert updated_user['detail'] == 'Username must not contain spaces.'


## TESTS FOR DELETE ENDPOINT
def test_delete_user(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    data = {"email": 'email_delete', "username": 'usrname_delete', "first_name": first_name, "last_name": last_name, "password": password}
    r = client.post(
        f"/users/",
        json=data,
    )

    user = r.json()

    access_token=create_access_token(user['id'],expires_delta=timedelta(minutes=settings.TOKEN_EXPIRE_TIME))
    headers = {"Authorization": f"Bearer {access_token}"}

    user = crud.user.get_user_by_name(session=db, name='usrname_delete')

    r = client.delete(
        f"/users/{user.id}",
        headers=headers,
    )

    assert r.status_code == 200
    deleted_user = r.json()
    assert deleted_user["message"] == "User deleted successfully"

def test_delete_user_not_owner(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    r = client.delete(
        f"/users/99999999",
        headers=logged_user_token_headers,
    )
    
    assert r.status_code == 403
    assert r.json()["detail"] == "You do not have permission to do this action"

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

    assert len(all_users['users']) > 1
    for item in all_users['users']:
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
        assert all_users['users'] == []
    finally:
        db.rollback()

def test_login_user_by_email(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='login_email', username='login_email', first_name=first_name, last_name=last_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    data = {"username": 'login_email', "password": password}

    r = client.post(
        f"/users/login/access-token",
        data=data,
    )

    assert r.status_code == 200
    logged_user = r.json()
    assert "access_token" in logged_user

def test_login_user_by_username(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='login_username', username='login_username', first_name=first_name, last_name=last_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    data = {"username": 'login_username', "password": password}

    r = client.post(
        f"/users/login/access-token",
        data=data,
    )

    assert r.status_code == 200
    logged_user = r.json()
    assert "access_token" in logged_user

def test_login_user_missing_fields(
    client: TestClient, db: Session
) -> None:
    data = {"password": password}

    r = client.post(
        f"/users/login/access-token",
        data=data,
    )

    assert r.status_code == 422
    logged_user = r.json()
    assert logged_user['detail'][0]['msg'] == 'Field required'

def test_login_user_not_found(
    client: TestClient, db: Session
) -> None:
    data = {"username": 'NO', "email": 'NO', "password": password}

    r = client.post(
        f"/users/login/access-token",
        data=data,
    )

    assert r.status_code == 400
    logged_user = r.json()
    assert logged_user['detail'] == 'Either a user with this email or username does not exist or the password is incorrect.'

def test_login_user_incorrect_pwd(
    client: TestClient, db: Session
) -> None:
    user_in = UserCreate(email='login_pwd', username='login_pwd', first_name=first_name, last_name=last_name, password=password)
    crud.user.create_user(session=db, user_create=user_in)

    data = {"username": 'login_pwd', "email": 'login_pwd', "password": 'incorrect'}

    r = client.post(
        f"/users/login/access-token",
        data=data,
    )

    assert r.status_code == 400
    logged_user = r.json()
    assert logged_user['detail'] == 'Either a user with this email or username does not exist or the password is incorrect.'
