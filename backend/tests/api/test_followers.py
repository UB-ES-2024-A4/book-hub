import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.models import User, Followers

unique_password = "password123"

# Define the fixture for creating dummy users
@pytest.fixture(scope="module")
def dummy_users(client: TestClient) -> tuple:
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

    # Return created users for use in tests
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
    return response


def unfollow_user(client: TestClient, followee_id: int) -> dict:
    """Unfollow a user and return the follow relationship."""
    response = client.post(f"/followers/unfollow/{followee_id}")
    assert response.status_code == 200, f"Failed to unfollow: {response.text}"
    return response.json()


def test_follow_user_success(client: TestClient, dummy_users):
    """Test the follow functionality."""
    # Arrange: Get dummy users
    user1, user2, user3 = dummy_users

    # Login as user1 to get the token
    token_user1 = login_user(client, username=user1["email"], password=unique_password)
    
    # Set the authorization header with the token
    headers = {
        "Authorization": f"Bearer {token_user1}"
    }

    # Act: user1 follows user2
    follow_relationship_1 = follow_user(client, followee_id=user2["id"], header=headers)

    # Assert: Verify the follow relationship
    assert follow_relationship_1.json()["success"] is True
    assert follow_relationship_1.json()["message"] == "User followed successfully"


    # Act: user1 follows user3
    follow_relationship_2 = follow_user(client, followee_id=user3["id"], header=headers)

    # Assert: Verify the second follow relationship
    assert follow_relationship_2.json()["success"] is True
    assert follow_relationship_2.json()["message"] == "User followed successfully"


def test_follow_user_same_user(client: TestClient, dummy_users):
    """Test the case when a user tries to follow themselves."""
    # Arrange: Get dummy users (already done in fixture)
    user1, _, _ = dummy_users

    # Login as user1 to get the token
    token_user1 = login_user(client, username=user1["email"], password=unique_password)
    
    # Set the authorization header with the token
    headers = {
        "Authorization": f"Bearer {token_user1}"
    }

    # Act: user1 tries to follow themselves
    response = follow_user(client, followee_id=user1["id"], header=headers)

    # Assert: Check that following oneself is not allowed
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    assert response.json()["detail"] == "Cannot follow yourself.", \
            f"Expected error message 'Cannot follow yourself.', but got {response.json()['detail']}"


def test_follow_user_non_existent_user(client: TestClient, dummy_users):
    """Test the case when a user tries to follow a non-existent user."""
    # Arrange: Get dummy users
    user1, _, _ = dummy_users

    # Login as user1 to get the token
    token_user1 = login_user(client, username=user1["email"], password=unique_password)
    
    # Set the authorization header with the token
    headers = {
        "Authorization": f"Bearer {token_user1}"
    }

    # Act: user1 tries to follow a non-existent user
    response = follow_user(client, followee_id=99999, header=headers)

    # Assert: Check that the error message is correct
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    assert response.json()["detail"] == "The user you are trying to follow does not exists."


def test_follow_user_unauthenticated(client: TestClient, dummy_users):
    """Test the case when an unauthenticated user tries to follow another user."""
    # Arrange: Get dummy users
    _, user2, _ = dummy_users

    # Act: Try to follow without authentication
    response = follow_user(client, followee_id=user2["id"], header={})

    # Assert: Ensure that the response status is 401 Unauthorized
    assert response.status_code == 401, f"Expected 401, but got {response.status_code}"
    assert response.json()["detail"] == "Not authenticated"


def test_follow_user_already_following(client: TestClient, dummy_users):
    """Test the case when a user tries to follow someone they are already following."""
    # Arrange: Get dummy users
    user1, user2, _ = dummy_users

    # Login as user1 to get the token
    token_user1 = login_user(client, username=user1["email"], password=unique_password)
    
    # Set the authorization header with the token
    headers = {
        "Authorization": f"Bearer {token_user1}"
    }

    # In the test_follow_user_success user1 followed user2 and user3
    # So, no need to do it again as it has been done previously.

    # Act: user1 tries to follow user2 again
    response = follow_user(client, followee_id=user2["id"], header=headers)

    # Assert: Ensure the behavior is handled if already following (this depends on your logic)
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    assert response.json()["detail"] == "You are already following this user."


def get_followers(client: TestClient, user_id: int) -> dict:
    """Get followers of a user."""
    response = client.get(f"/followers/get_followers/{user_id}")
    return response


def test_get_followers_success(client: TestClient, dummy_users):
    """Test the case when a user successfully retrieves their followers."""
    # Arrange: Get dummy users
    user1, user2, user3 = dummy_users
    
    # In the test_follow_user_success user1 followed user2 and user3
    # So it means that user2 and user3 have 1 follower user1

    # Act: user2 gets their followers
    response = get_followers(client, user_id=user2["id"])

    # Assert: Verify that the response contains a list of followers
    assert response.status_code == 200, f"Expected 200, but got {response.status_code}"
    assert isinstance(response.json(), dict), f"Expected dict, but got {type(response.json())}"

    # Act: user3 gets their followers
    response = get_followers(client, user_id=user3["id"])

    # Assert: Verify that the response contains a list of followers
    assert response.status_code == 200, f"Expected 200, but got {response.status_code}"
    assert isinstance(response.json(), dict), f"Expected dict, but got {type(response.json())}"


def test_get_followers_no_followers(client: TestClient, dummy_users):
    """Test the case when a user has no followers."""
    # Arrange: Create dummy users
    user1, _, _ = dummy_users

    # Act: user1 gets their followers (no followers)
    response = get_followers(client, user_id=user1["id"])

    # As I said earlier that user1 doesnot have any followers so this should show error

    # Assert: Verify that the response is an empty list
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    assert response.json()["detail"] == "No followers found for this user."


def test_get_followers_invalid_user(client: TestClient):
    """Test the case when trying to get followers of a non-existent user."""
    # Arrange: Non-existent user ID
    non_existent_user_id = 99999

    # Act: Try to get followers of the non-existent user
    response = get_followers(client, user_id=non_existent_user_id)

    # Assert: Verify that the response returns a 404 error
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    assert response.json()["detail"] == "The user does not exists."
