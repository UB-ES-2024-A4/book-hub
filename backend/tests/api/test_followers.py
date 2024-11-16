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


###################################################
## Test all endpoints for follow endpoint ##
###################################################

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


###################################################
## Test all endpoints for get followers endpoint ##
###################################################

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
    assert response.json()["followers"][0]["id"] == user1["id"]

    # Act: user3 gets their followers
    response = get_followers(client, user_id=user3["id"])

    # Assert: Verify that the response contains a list of followers
    assert response.status_code == 200, f"Expected 200, but got {response.status_code}"
    assert isinstance(response.json(), dict), f"Expected dict, but got {type(response.json())}"
    assert response.json()["followers"][0]["id"] == user1["id"]



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


###################################################
## Test all endpoints for get followees endpoint ##
###################################################

def get_followees(client: TestClient, user_id: int,) -> dict:
    """Get followees of a user."""
    response = client.get(f"followers/get_followings/{user_id}")
    return response


def test_get_followees_success(client: TestClient, dummy_users):
    """Test the case when a user successfully retrieves their followees."""
    # Arrange: Create dummy users
    user1, user2, user3 = dummy_users

    # User1 is following user2 and user3 so they are there followees

    # Act: user1 gets their followees
    response = get_followees(client, user_id=user1["id"])

    # Assert: Verify that the response contains user2 as a followee
    assert response.status_code == 200, f"Expected 200, but got {response.status_code}"
    assert isinstance(response.json(), dict), f"Expected dict, but got {type(response.json())}"
    assert response.json()["followers"][0]["id"] == user2["id"]
    assert response.json()["followers"][1]["id"] == user3["id"]



def test_get_followees_no_followees(client: TestClient, dummy_users):
    """Test the case when a user has no followees."""
    # Arrange: Create dummy users
    _, user2, _ = dummy_users

    # Act: user2 gets their followees (no followees beacuse user2 doesnot followed anyone)
    response = get_followees(client, user_id=user2["id"])

    # Assert: Verify that the response is an empty list
    assert response.status_code == 400, f"Expected 200, but got {response.status_code}"
    assert response.json()["detail"] == "No followers found for this user."


def test_get_followees_invalid_user(client: TestClient):
    """Test the case when trying to get followees for a non-existent user."""
    # Arrange: Non-existent user ID
    non_existent_user_id = 99999

    # Act: Try to get followees of the non-existent user
    response = get_followees(client, user_id=non_existent_user_id)

    # Assert: Verify that the response returns a 400 error (user not found)
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    assert response.json()["detail"] == "The user does not exists.", "Expected 'The user does not exists.' message."


##########################################################
## Test all endpoints for get mutual followers endpoint ##
##########################################################

def get_mutual_followers(client: TestClient, user_id_1: int, user_id_2: int) -> dict:
    """Get mutual followers between two users."""
    response = client.get(f"/followers/mutual-followers/{user_id_1}/{user_id_2}")
    return response


def test_get_mutual_followers_success(client: TestClient, dummy_users):
    """Test the case when two users have mutual followers."""
    # Arrange: Create dummy users
    user1, user2, user3 = dummy_users

    # As explained before, user1 is following user2 and user3, so user2 and user3 have a mutual 
    # follower which is user1

    # Act: Get mutual followers
    response = get_mutual_followers(client, user_id_1=user2["id"], user_id_2=user3["id"])

    # Assert: Verify mutual followers are returned correctly
    assert response.status_code == 200, f"Expected 200, but got {response.status_code}"
    assert response.json()["count"] == 1, "Expected 1 mutual follower"
    assert response.json()["followers"][0]["id"] == user1["id"], "Expected user1 as mutual follower"


def test_get_mutual_followers_no_mutuals(client: TestClient, dummy_users):
    """Test the case when two users have no mutual followers."""
    # Arrange: Create dummy users
    user1, user2, _ = dummy_users

    # Act: user1 and user2 have no mutual followers
    response = get_mutual_followers(client, user_id_1=user1["id"], user_id_2=user2["id"])

    # Assert: Verify that no mutual followers are found
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    assert response.json()["detail"] == "No mutual followers found."


def test_get_mutual_followers_invalid_user(client: TestClient):
    """Test the case when one or both users do not exist."""
    # Arrange: Non-existent user IDs
    non_existent_user_id_1 = 99999
    non_existent_user_id_2 = 88888

    # Act: Try to get mutual followers with invalid users
    response = get_mutual_followers(client, user_id_1=non_existent_user_id_1, user_id_2=non_existent_user_id_2)

    # Assert: Verify the response contains the error message for invalid users
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    assert response.json()["detail"] == "One or both users do not exist.", "Expected 'One or both users do not exist.' message."


#########################################################
## Test all endpoints for most followed users endpoint ##
#########################################################

@pytest.fixture(scope="module")
def setup_users_with_followers(client: TestClient) -> list[dict]:
    """Set up multiple users with varying follower counts."""
    users = []
    for i in range(1, 6):  # Create 5 users
        user_data = {
            "username": f"user_{i}",
            "email": f"user_{i}@test.com",
            "password": unique_password,
            "first_name": f"FirstName_{i}",
            "last_name": f"LastName_{i}"
        }
        response = client.post("/users/", json=user_data)
        assert response.status_code == 200, f"Failed to create user {i}: {response.text}"
        users.append(response.json())

    # Create followers for the users
    for i, user in enumerate(users):
        for j in range(i):  # User i is followed by users 0 to i-1
            token = login_user(client, users[j]["email"], unique_password)
            headers = {"Authorization": f"Bearer {token}"}
            follow_user(client, followee_id=user['id'], header=headers)

    return users


def get_most_followed_users(client: TestClient, limit: int) -> dict:
    """Retrieve the most-followed users."""
    response = client.get(f"/followers/most-followed?limit={limit}")
    return response


def test_get_most_followed_users_success(client: TestClient):
    """Test retrieval of most-followed users with valid data."""

    # Act: Get the most-followed users
    response = get_most_followed_users(client, limit=3)

    # Assert: Verify response contains the correct number of most-followed users
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    most_followed_users = response.json()
    assert len(most_followed_users) == 3, f"Expected 3 users, got {len(most_followed_users)}"
    assert most_followed_users[0]["followers_count"] > most_followed_users[1]["followers_count"], \
        "Users should be sorted by followers count."

