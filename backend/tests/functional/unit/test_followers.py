import pytest
from sqlmodel import Session, create_engine, SQLModel
from app.models import User, Followers
from app.crud.followers import (
    follow_user, unfollow_user, is_following, get_followers, get_followees,
    get_mutual_followers, get_most_followed_users
)

def setup_test_db():
    """Setup an in-memory SQLite database for testing."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    return engine

@pytest.fixture(scope="function")
def session():
    """Provide a database session for tests."""
    engine = setup_test_db()
    with Session(engine) as session:
        yield session

@pytest.fixture(scope="function")
def sample_users(session):
    """Add sample users to the database for testing."""
    users = [
        User(id=1, username="user1", email="user1@test.com", password="password1"),
        User(id=2, username="user2", email="user2@test.com", password="password2"),
        User(id=3, username="user3", email="user3@test.com", password="password3"),
    ]
    session.add_all(users)
    session.commit()
    return users

# Test: follow_user
def test_follow_user(session, sample_users):
    follow = follow_user(session=session, follower_id=1, followee_id=2)
    assert follow.follower_id == 1
    assert follow.followee_id == 2
    
    with pytest.raises(ValueError):
        follow_user(session=session, follower_id=1, followee_id=2)

# Test: unfollow_user
def test_unfollow_user(session, sample_users):
    follow_user(session=session, follower_id=1, followee_id=2)
    result = unfollow_user(session=session, follower_id=1, followee_id=2)
    assert result is True

    with pytest.raises(ValueError):
        unfollow_user(session=session, follower_id=1, followee_id=2)

# Test: is_following
def test_is_following(session, sample_users):
    assert not is_following(session=session, follower_id=1, followee_id=2)
    follow_user(session=session, follower_id=1, followee_id=2)
    assert is_following(session=session, follower_id=1, followee_id=2)

# Test: get_followers
def test_get_followers(session, sample_users):
    follow_user(session=session, follower_id=2, followee_id=1)
    followers = get_followers(session=session, user_id=1)
    assert len(followers) == 1
    assert followers[0].id == 2
    assert followers[0].username == "user2"

# Test: get_followees
def test_get_followees(session, sample_users):
    follow_user(session=session, follower_id=1, followee_id=2)
    follow_user(session=session, follower_id=1, followee_id=3)
    followees = get_followees(session=session, user_id=1)
    assert len(followees) == 2
    assert {f.username for f in followees} == {"user2", "user3"}

# Test: get_mutual_followers
def test_get_mutual_followers(session, sample_users):
    follow_user(session=session, follower_id=2, followee_id=1)
    follow_user(session=session, follower_id=3, followee_id=1)
    follow_user(session=session, follower_id=2, followee_id=3)
    follow_user(session=session, follower_id=3, followee_id=2)

    mutual_followers = get_mutual_followers(session=session, user_id_1=1, user_id_2=3)
    assert len(mutual_followers) == 1
    assert mutual_followers[0].id == 2

# Test: get_most_followed_users
def test_get_most_followed_users(session, sample_users):
    follow_user(session=session, follower_id=2, followee_id=1)
    follow_user(session=session, follower_id=3, followee_id=1)
    follow_user(session=session, follower_id=1, followee_id=2)

    most_followed = get_most_followed_users(session=session, limit=2)
    assert len(most_followed) == 2
    assert most_followed[0]['user_id'] == 1
    assert most_followed[0]['followers_count'] == 2
    assert most_followed[1]['user_id'] == 2
    assert most_followed[1]['followers_count'] == 1
