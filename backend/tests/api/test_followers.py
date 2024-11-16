import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.models import User, Followers

unique_password = "password123"

def create_dummy_users(client: TestClient) -> tuple[dict, dict, dict]:
    """Create dummy users before the tests of the followers."""

    # Here we only create these users, the test of the users creation has already been done, 
    # so no need here. We just add these users to the database to test our followers endpoints
    # which we have created and cover all the aspects.

    # Define the dummy users' data
    user_data_list = [
        {
            "username": "test_user_1",
            "email": "test_user_1@test.com",
            "password": unique_password,
            "first_name": "Test1",
            "last_name": "User1"
        },
        {
            "username": "test_user_2",
            "email": "test_user_2@test.com",
            "password": unique_password,
            "first_name": "Test2",
            "last_name": "User2"
        },
        {
            "username": "test_user_3",
            "email": "test_user_3@test.com",
            "password": unique_password,
            "first_name": "Test3",
            "last_name": "User3"
        },
    ]

    # Create users and return their details
    created_users = []
    for user_data in user_data_list:
        response = client.post("/users/", json=user_data)
        assert response.status_code == 200, f"Failed to create user: {response.text}"
        created_users.append(response.json())

    return tuple(created_users)


def login_user(client: TestClient, username: str, password: str) -> str:
    """Login and retrieve the auth token."""
    login_data = {"username": username, "password": password}
    response = client.post("/users/login/access-token", data=login_data)
    
    # Ensure login was successful and extract token
    assert response.status_code == 200, f"Failed to login: {response.text}"
    return response.json()["access_token"]  



def follow_user(client: TestClient, followee_id: int, header: dict) -> dict:
    """Follow a user and return the follow relationship."""
    response = client.post(f"/followers/follow/{followee_id}", headers=header)
    assert response.status_code == 200, f"Failed to follow: {response.text}"
    return response.json()


def unfollow_user(client: TestClient, followee_id: int) -> dict:
    """Unfollow a user and return the follow relationship."""
    response = client.post(f"/followers/unfollow/{followee_id}")
    assert response.status_code == 200, f"Failed to unfollow: {response.text}"
    return response.json()


def test_follow_user(client: TestClient):
    """Test the follow functionality."""
    # Arrange: Create dummy users
    user1, user2, user3 = create_dummy_users(client)

    # Login as user1 to get the token
    token_user1 = login_user(client, username=user1["email"], password=unique_password)
    
    # Set the authorization header with the token
    headers = {
        "Authorization": f"Bearer {token_user1}"
    }

    # Act: user1 follows user2
    follow_relationship_1 = follow_user(client, followee_id=user2["id"], header=headers)

    # Assert: Verify the follow relationship
    assert follow_relationship_1["success"] is True
    assert follow_relationship_1["message"] == "User followed successfully"


    # Act: user1 follows user3
    follow_relationship_2 = follow_user(client, followee_id=user3["id"], header=headers)

    # Assert: Verify the second follow relationship
    assert follow_relationship_2["success"] is True
    assert follow_relationship_2["message"] == "User followed successfully"





# # Test cases for get_followers endpoint
# def test_get_followers_success(override_get_db, seed_data):
#     """Test case for successfully retrieving followers."""
#     response = client.get("/followers/1")  # Get followers for user1
#     assert response.status_code == 200
#     data = response.json()
    
#     assert len(data) == 2
#     assert data[0]["username"] == "user2"
#     assert data[1]["username"] == "user3"

# def test_get_followers_no_followers(override_get_db, seed_data):
#     """Test case for a user with no followers."""
#     response = client.get("/followers/2")  # Get followers for user2
#     assert response.status_code == 200
#     data = response.json()
#     assert len(data) == 0

# def test_get_followers_invalid_user(override_get_db, seed_data):
#     """Test case for a non-existent user."""
#     response = client.get("/followers/999")  # Get followers for a non-existent user
#     assert response.status_code == 200
#     data = response.json()
#     assert len(data) == 0
