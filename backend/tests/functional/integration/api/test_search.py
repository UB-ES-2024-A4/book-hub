import pytest
from fastapi.testclient import TestClient
from app.models import User
from app.core.database import get_session
from sqlmodel import Session
from app.core.security import get_password_hash
from tests.functional.integration.api.test_followers import login_user

unique_password = "password123"

# Helper function to create a user
def create_user(db: Session, email: str, username: str):
    user = User(
        email=email,
        username=username,
        first_name="Test",
        last_name="User",
        biography="Test biography",
        password=get_password_hash(unique_password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="module")
def create_sample_users(db):
    # Create sample users for testing
    user1 = create_user(db, "test1@example.com", "testuser1")
    user2 = create_user(db, "test2@example.com", "testuser2")
    user3 = create_user(db, "test3@example.com", "testuser3")
    return [user1, user2, user3]


def search_users(client: TestClient, query: str, create_sample_users) -> dict:
    user1, _, _ = create_sample_users

    # Login as user1 to get the token
    token_user1 = login_user(client, username=user1.email, password=unique_password)
    
    # Set the authorization header with the token
    headers = {
        "Authorization": f"Bearer {token_user1}"
    }

    response = client.get(f"/search/?query={query}", headers=headers)
    return response


def test_search_users_valid_query(client: TestClient, create_sample_users):
    # Test valid search query
    response = search_users(client=client, query="testuser", create_sample_users=create_sample_users)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data['users']) == 3  # Assuming all users match the query
    assert all(user['username'].startswith('testuser') for user in data['users'])


def test_search_users_empty_query(client: TestClient, create_sample_users):
    # Test empty query
    response = search_users(client=client, query="", create_sample_users=create_sample_users)
    assert response.status_code == 422  # FastAPI will return a 422 error for invalid input -> Unprocessable entity


def test_search_users_query_too_short(client: TestClient, create_sample_users):
    # Test query with fewer than 3 characters
    response = search_users(client=client, query="te", create_sample_users=create_sample_users)
    
    assert response.status_code == 422  # Expect 422 for invalid query length


def test_search_users_no_matching_results(client: TestClient, create_sample_users):
    # Test query with no matching users
    response = search_users(client=client, query="nonexistentuser", create_sample_users=create_sample_users)
    
    assert response.status_code == 200  # Search should succeed
    data = response.json()
    assert len(data['users']) == 0  # No users should match the query


def test_search_users_case_insensitive(client: TestClient, create_sample_users):
    # Test case-insensitive search
    response = search_users(client=client, query="TESTUSER1", create_sample_users=create_sample_users)
    
    assert response.status_code == 200
    data = response.json()
    assert any(user['username'] == "testuser1" for user in data['users'])  # Ensure case insensitivity


def test_search_users_special_characters_in_query(client: TestClient, create_sample_users):
    # Test search with special characters
    response = search_users(client=client, query="testuser@", create_sample_users=create_sample_users)
    
    assert response.status_code == 200
    data = response.json()
    print(data)
    assert not any(user['username'].startswith("test") for user in data['users'])  # Test if special characters are handled


def test_search_users_not_authenticated(client: TestClient):
    # Test unauthenticated user trying to search
    query="testuser"
    response = client.get(f"/search/?query={query}")
    
    assert response.status_code == 401  # Expect 401 Unauthorized for unauthenticated access
    assert "detail" in response.json()  # Check for error message in the response
    assert response.json()["detail"] == "Not authenticated"


def test_search_users_invalid_token(client: TestClient, create_sample_users):
    # Test with an invalid token
    query="testuser"
    headers = {
        "Authorization": "Bearer invalidtoken"
    }
    response = client.get(f"/search/?query={query}", headers=headers)
    
    assert response.status_code == 403  # Expect 403 Unauthorized for invalid token or expired token
    assert "detail" in response.json()  # Check for error message in the response
    assert response.json()["detail"] == "Could not validate credentials"
