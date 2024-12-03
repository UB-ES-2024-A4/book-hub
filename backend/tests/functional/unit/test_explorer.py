from unittest.mock import MagicMock, patch
import pytest
from app.models import PostOutHome, UserOutHome, PostOutHomeOnly, Book
from app.utils import get_explorer_posts, get_explorer_posts_db

def test_get_explorer_posts_empty_data():
    # Mock dependencies
    mock_session = MagicMock()
    mock_user = MagicMock(id=1)
    
    # Mock get_explorer_posts_db to return an empty list
    with patch("app.utils.get_explorer_posts_db", return_value=[]):
        result = get_explorer_posts(
            session=mock_session,
            user=mock_user,
            filters="",
            skip=0,
            limit=10,
        )
    
    # Assertions
    assert result == []  # Should return an empty list


def test_get_explorer_posts_with_data():
    # Mock session and user
    mock_session = MagicMock()
    mock_user = MagicMock(id=1)
    
    # Mock data returned by get_explorer_posts_db
    mock_posts = [
        MagicMock(
            post_id=1, user_id=1, username="user1", likes=10,
            post_description="Post 1", created_at="2024-03-12T00:00:00",
            like_set=True, book_id=1, book_title="Book 1", book_author="Author 1",
            book_description="Description 1", book_created_at="2024-02-12T00:00:00",
            num_comments=5, filters="1,2,3"
        )
    ]
    
    # Mock get_explorer_posts_db
    with patch("app.utils.get_explorer_posts_db", return_value=mock_posts):
        # Mock the session.exec for following_users
        mock_session.exec.return_value.all.return_value = [1]
        
        result = get_explorer_posts(
            session=mock_session,
            user=mock_user,
            filters="1",
            skip=0,
            limit=10,
        )
    
    # Assertions
    assert len(result) == 1  # Should return one post
    post = result[0]
    assert isinstance(post, PostOutHome)
    assert post.user.username == "user1"
    assert post.user.following is True
    assert post.post.likes == 10


def test_get_explorer_posts_no_user():
    # Mock session with no user
    mock_session = MagicMock()
    
    # Mock data returned by get_explorer_posts_db
    mock_posts = [
        MagicMock(
            post_id=1, user_id=1, username="user1", likes=10,
            post_description="Post 1", created_at="2024-01-01T00:00:00",
            like_set=False, book_id=1, book_title="Book 1", book_author="Author 1",
            book_description="Description 1", book_created_at="2024-01-01T00:00:00",
            num_comments=0, filters="1,2"
        )
    ]
    
    # Mock get_explorer_posts_db
    with patch("app.utils.get_explorer_posts_db", return_value=mock_posts):
        # Mock the session.exec for following_users
        mock_session.exec.return_value.all.return_value = []
        
        result = get_explorer_posts(
            session=mock_session,
            user=None,
            filters="1",
            skip=0,
            limit=10,
        )
    
    # Assertions
    assert len(result) == 1
    post = result[0]
    assert post.user.following is False  # No user means no followers check


def test_get_explorer_posts_error_handling():
    # Mock session and user
    mock_session = MagicMock()
    mock_user = MagicMock(id=1)
    
    # Mock get_explorer_posts_db to raise an exception
    with patch("app.utils.get_explorer_posts_db", side_effect=Exception("DB Error")):
        with pytest.raises(Exception, match="DB Error"):
            get_explorer_posts(
                session=mock_session,
                user=mock_user,
                filters="",
                skip=0,
                limit=10,
            )

def test_get_explorer_posts_no_matching_filters():
    # Mock session and user
    mock_session = MagicMock()
    mock_user = MagicMock(id=1)
    
    # Mock get_explorer_posts_db to return an empty list for filters
    with patch("app.utils.get_explorer_posts_db", return_value=[]):
        result = get_explorer_posts(
            session=mock_session,
            user=mock_user,
            filters="999",  # Non-existent filter
            skip=0,
            limit=10,
        )
    
    # Assertions
    assert result == []  # No posts should match


def test_get_explorer_posts_multiple_posts():
    # Mock session and user
    mock_session = MagicMock()
    mock_user = MagicMock(id=1)
    
    # Mock data for multiple posts
    mock_posts = [
        MagicMock(
            post_id=i, user_id=1, username=f"user{i}", likes=10,
            post_description=f"Post {i}", created_at="2024-01-01T00:00:00",
            like_set=True, book_id=i, book_title=f"Book {i}", book_author=f"Author {i}",
            book_description=f"Description {i}", book_created_at="2024-01-01T00:00:00",
            num_comments=i, filters="1,2"
        )
        for i in range(1, 4)  # Create 3 mock posts
    ]
    
    with patch("app.utils.get_explorer_posts_db", return_value=mock_posts):
        mock_session.exec.return_value.all.return_value = [1]
        
        result = get_explorer_posts(
            session=mock_session,
            user=mock_user,
            filters="1",
            skip=0,
            limit=10,
        )
    
    # Assertions
    assert len(result) == 3  # Should return three posts
    for i, post in enumerate(result, start=1):
        assert post.user.username == f"user{i}"
        assert post.post.likes == 10


def test_get_explorer_posts_no_filters():
    # Mock session and user
    mock_session = MagicMock()
    mock_user = MagicMock(id=1)
    
    # Mock data for posts
    mock_posts = [
        MagicMock(
            post_id=1, user_id=1, username="user1", likes=10,
            post_description="Post 1", created_at="2024-01-01T00:00:00",
            like_set=True, book_id=1, book_title="Book 1", book_author="Author 1",
            book_description="Description 1", book_created_at="2024-01-01T00:00:00",
            num_comments=0, filters="1,2"
        )
    ]
    
    with patch("app.utils.get_explorer_posts_db", return_value=mock_posts):
        mock_session.exec.return_value.all.return_value = [1]
        
        result = get_explorer_posts(
            session=mock_session,
            user=mock_user,
            filters="",  # No filters
            skip=0,
            limit=10,
        )
    
    # Assertions
    assert len(result) == 1
    assert result[0].post.description == "Post 1"


def test_get_explorer_posts_user_no_followers():
    # Mock session and user
    mock_session = MagicMock()
    mock_user = MagicMock(id=1)
    
    # Mock data for posts
    mock_posts = [
        MagicMock(
            post_id=1, user_id=1, username="user1", likes=10,
            post_description="Post 1", created_at="2024-01-01T00:00:00",
            like_set=False, book_id=1, book_title="Book 1", book_author="Author 1",
            book_description="Description 1", book_created_at="2024-01-01T00:00:00",
            num_comments=0, filters="1,2"
        )
    ]
    
    with patch("app.utils.get_explorer_posts_db", return_value=mock_posts):
        mock_session.exec.return_value.all.return_value = []  # No followers
        
        result = get_explorer_posts(
            session=mock_session,
            user=mock_user,
            filters="1",
            skip=0,
            limit=10,
        )
    
    # Assertions
    assert len(result) == 1
    assert result[0].user.following is False  # User follows no one


def test_get_explorer_posts_pagination():
    # Mock session and user
    mock_session = MagicMock()
    mock_user = MagicMock(id=1)
    
    # Mock data for pagination
    mock_posts = [
        MagicMock(
            post_id=i, user_id=1, username=f"user{i}", likes=10,
            post_description=f"Post {i}", created_at="2024-01-01T00:00:00",
            like_set=True, book_id=i, book_title=f"Book {i}", book_author=f"Author {i}",
            book_description=f"Description {i}", book_created_at="2024-01-01T00:00:00",
            num_comments=i, filters="1,2"
        )
        for i in range(1, 11)  # Create 10 mock posts
    ]
    
    with patch("app.utils.get_explorer_posts_db", return_value=mock_posts[:5]):
        mock_session.exec.return_value.all.return_value = [1]
        
        result = get_explorer_posts(
            session=mock_session,
            user=mock_user,
            filters="1",
            skip=0,
            limit=5,  # Limit to 5 posts
        )
    
    # Assertions
    assert len(result) == 5
    assert result[0].post.description == "Post 1"
    assert result[4].post.description == "Post 5"