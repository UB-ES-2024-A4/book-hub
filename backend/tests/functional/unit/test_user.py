import pytest
from unittest.mock import MagicMock
from app.crud.user import (
    create_user,
    update_user,
    delete_user,
    get_user,
    get_user_by_name,
    get_all_users,
    get_user_by_email,
    authenticate
)
from app.models import User, UserCreate, UserUpdate
from app.core.security import pwd_crypt

# Mock session
@pytest.fixture
def mock_session():
    return MagicMock()

# Test `create_user`
def test_create_user(mock_session):
    user_data = UserCreate(username="testuser", email="test@test.com", password="testpass")
    created_user = create_user(session=mock_session, user_create=user_data)

    # Assert password is hashed
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(created_user)
    assert created_user.password != "testpass"

# Test `update_user`
def test_update_user_existing_user(mock_session):
    mock_user = User(id=1, username="existing_user", password="hashedpass")
    mock_session.get.return_value = mock_user

    update_data = UserUpdate(password="newpassword")
    updated_user = update_user(session=mock_session, user_id=1, user=update_data)

    assert updated_user.password != "newpassword"  # Password should be hashed
    mock_session.commit.assert_called_once()

def test_update_user_nonexistent_user(mock_session):
    mock_session.get.return_value = None
    update_data = UserUpdate(username="nonexistent_user")

    result = update_user(session=mock_session, user_id=999, user=update_data)

    assert result is None
    mock_session.commit.assert_not_called()

# Test `delete_user`
def test_delete_user_existing_user(mock_session):
    mock_user = User(id=1, username="user_to_delete")
    mock_session.get.return_value = mock_user

    deleted_user = delete_user(session=mock_session, user_id=1)

    assert deleted_user == mock_user
    mock_session.delete.assert_called_once_with(mock_user)
    mock_session.commit.assert_called_once()

def test_delete_user_nonexistent_user(mock_session):
    mock_session.get.return_value = None

    deleted_user = delete_user(session=mock_session, user_id=999)

    assert deleted_user is None
    mock_session.delete.assert_not_called()
    mock_session.commit.assert_not_called()

# Test `get_user`
def test_get_user(mock_session):
    mock_user = User(id=1, username="test_user")
    mock_session.get.return_value = mock_user

    result = get_user(session=mock_session, user_id=1)

    assert result == mock_user
    mock_session.get.assert_called_once_with(User, 1)

# Test `get_user_by_name`
def test_get_user_by_name(mock_session):
    mock_user = User(username="test_user")
    mock_session.exec.return_value.first.return_value = mock_user

    result = get_user_by_name(session=mock_session, name="test_user")

    assert result == mock_user

# Test `get_all_users`
def test_get_all_users(mock_session):
    mock_users = [User(id=1, username="user1"), User(id=2, username="user2")]
    mock_session.exec.return_value.all.return_value = mock_users

    result = get_all_users(session=mock_session)

    assert result == mock_users

# Test `get_user_by_email`
def test_get_user_by_email(mock_session):
    mock_user = User(email="test@test.com")
    mock_session.exec.return_value.first.return_value = mock_user

    result = get_user_by_email(session=mock_session, email="test@test.com")

    assert result == mock_user

# Test `authenticate`
def test_authenticate_valid(mock_session):
    # Create a real bcrypt hash
    hashed_password = pwd_crypt.hash("correctpassword")
    mock_user = User(email="test@test.com", password=hashed_password)
    mock_session.exec.return_value.first.return_value = mock_user

    # No need to monkeypatch as the real hash is used
    result = authenticate(session=mock_session, email="test@test.com", password="correctpassword")

    assert result == mock_user


def test_authenticate_invalid(mock_session):
    mock_session.exec.return_value.first.return_value = None

    result = authenticate(session=mock_session, email="wrong@test.com", password="wrongpassword")

    assert result is None
