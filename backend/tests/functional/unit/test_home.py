import pytest
from unittest.mock import Mock, MagicMock
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.utils import get_home_posts_for_user, get_home_posts, get_home_comments
from app.models import User, PostOutHome

@pytest.fixture
def mock_session():
    """Fixture to create a mock session."""
    session = MagicMock(spec=Session)
    session.exec = MagicMock()  # Mock the exec method specifically
    return session


@pytest.fixture
def mock_user():
    """Fixture to create a mock user."""
    return User(id=1, username="test_user")


def test_empty_results(mock_session, mock_user):
    """Test when no posts or comments are returned."""
    mock_session.exec.return_value.fetchall.side_effect = [[], []]

    result = get_home_posts_for_user(
        session=mock_session,
        user=mock_user,
        filters="",
        skip=0,
        limit=10
    )

    assert result == []


def test_get_home_posts_for_user(mock_session, mock_user):
    """Test the get_home_posts_for_user method."""
    # Mock the results of get_home_posts and get_home_comments
    mock_posts = [
        Mock(post_id=1, user_id=2, username="other_user", likes=5, post_description="Test post", 
             created_at="2024-12-01", like_set=True, book_id=1, book_title="Test Book", 
             book_author="Author", book_description="Description", book_created_at="2024-12-01", 
             filters="1,2,3", num_comments=2),
    ]
    mock_comments = [
        Mock(post_id=1, comment_id=1, commenter_id=3, commenter_username="commenter_user", 
             comment="Test comment", created_at="2024-12-01", is_following_commenter=True),
    ]

    mock_session.exec.return_value.fetchall.side_effect = [mock_posts, mock_comments]

    # Call the method
    result = get_home_posts_for_user(
        session=mock_session,
        user=mock_user,
        filters="",
        skip=0,
        limit=10
    )

    # Assertions
    assert len(result) == 1
    assert isinstance(result[0], PostOutHome)
    assert result[0].n_comments == 2
    assert len(result[0].comments) == 1
    assert result[0].comments[0].comment == "Test comment"


def test_get_home_posts(mock_session, mock_user):
    """Test the get_home_posts method."""
    # Mock SQL query results
    mock_posts = [
        Mock(post_id=1, user_id=2, username="other_user", likes=5, post_description="Test post",
             created_at="2024-12-01", like_set=True, book_id=1, book_title="Test Book",
             book_author="Author", book_description="Description", book_created_at="2024-12-01",
             filters="1,2,3", num_comments=2),
    ]

    mock_session.exec.return_value.fetchall.return_value = mock_posts

    # Call the method
    result = get_home_posts(
        session=mock_session,
        user=mock_user,
        filters=[],
        skip=0,
        limit=10
    )

    # Assertions
    assert len(result) == 1
    assert result[0].post_id == 1
    assert result[0].username == "other_user"
    assert result[0].likes == 5


def test_get_home_comments(mock_session, mock_user):
    """Test the get_home_comments method."""
    # Mock SQL query results
    mock_comments = [
        Mock(post_id=1, comment_id=1, commenter_id=3, commenter_username="commenter_user",
             comment="Test comment", created_at="2024-12-01", is_following_commenter=True),
    ]

    mock_session.exec.return_value.fetchall.return_value = mock_comments

    # Call the method
    result = get_home_comments(
        session=mock_session,
        user=mock_user
    )

    # Assertions
    assert len(result) == 1
    assert result[0].post_id == 1
    assert result[0].comment == "Test comment"
    assert result[0].is_following_commenter is True


def test_pagination(mock_session, mock_user):
    """Test pagination with skip and limit."""
    mock_posts = [
        Mock(post_id=1, user_id=2, username="other_user", likes=5, post_description="Test post",
             created_at="2024-12-01", like_set=True, book_id=1, book_title="Test Book",
             book_author="Author", book_description="Description", book_created_at="2024-12-01",
             filters="1,2,3", num_comments=2),
        Mock(post_id=2, user_id=2, username="other_user", likes=10, post_description="Another post",
             created_at="2024-12-02", like_set=False, book_id=2, book_title="Another Book",
             book_author="Another Author", book_description="Another Description",
             book_created_at="2024-12-02", filters="4,5,6", num_comments=0),
    ]

    mock_session.exec.return_value.fetchall.side_effect = [mock_posts[:1], []]

    result = get_home_posts_for_user(
        session=mock_session,
        user=mock_user,
        filters="",
        skip=0,
        limit=1
    )

    assert len(result) == 1
    assert result[0].post.id == 1
    assert result[0].post.likes == 5


def test_filters_applied(mock_session, mock_user):
    """Test posts filtered by criteria."""
    mock_posts = [
        Mock(post_id=1, user_id=2, username="other_user", likes=5, post_description="Filtered post",
             created_at="2024-12-01", like_set=True, book_id=1, book_title="Filtered Book",
             book_author="Author", book_description="Description", book_created_at="2024-12-01",
             filters="specific", num_comments=2),
    ]

    mock_session.exec.return_value.fetchall.return_value = mock_posts

    result = get_home_posts(
        session=mock_session,
        user=mock_user,
        filters=["specific"],
        skip=0,
        limit=10
    )

    assert len(result) == 1
    assert result[0].post_id == 1
    assert "specific" in result[0].filters


def test_large_data(mock_session, mock_user):
    """Test with a large number of posts."""
    mock_posts = [
        Mock(post_id=i, user_id=2, username=f"user_{i}", likes=i, post_description=f"Post {i}",
             created_at="2024-12-01", like_set=(i % 2 == 0), book_id=i, book_title=f"Book {i}",
             book_author="Author", book_description="Description", book_created_at="2024-12-01",
             filters="1,2,3", num_comments=i % 3)
        for i in range(100)
    ]

    mock_session.exec.return_value.fetchall.return_value = mock_posts

    result = get_home_posts(
        session=mock_session,
        user=mock_user,
        filters=[],
        skip=0,
        limit=100
    )

    assert len(result) == 100
    assert result[99].post_id == 99


def test_no_relationships(mock_session, mock_user):
    """Test when the user follows no one and is followed by no one."""
    mock_posts = []
    mock_comments = []

    mock_session.exec.return_value.fetchall.side_effect = [mock_posts, mock_comments]

    result = get_home_posts_for_user(
        session=mock_session,
        user=mock_user,
        filters="",
        skip=0,
        limit=10
    )

    assert result == []


def test_error_handling(mock_session, mock_user):
    """Test how the method handles database errors."""
    mock_session.exec.side_effect = SQLAlchemyError("Database error")

    with pytest.raises(SQLAlchemyError):
        get_home_posts(
            session=mock_session,
            user=mock_user,
            filters=[],
            skip=0,
            limit=10
        )