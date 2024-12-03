from fastapi.testclient import TestClient

from app.models import User, UserCreate, Book, Like, Post
from sqlmodel import Session, select, text
from app.core.config import settings
from app import crud
from ..utils import check_quantity_likes

def get_test_parameters(db: Session):
    user_test = db.exec(
        select(User).where(User.username == 'TEST_NAME')
    ).first()

    book_test = db.exec(
        select(Book).where(Book.title == 'TEST')
    ).first()
    
    post_test = db.exec(
        select(Post).where(Post.book_id == book_test.id and Post.user_id == user_test.id)
    ).first()

    return user_test.id, post_test

def test_create_like_current_usr_not_owner(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    data = {'user_id': -1, 'post_id': post_test.id}

    r = client.post(
        '/likes/',
        headers=logged_user_token_headers,
        json=data
    )

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert r.status_code == 403
    created_like = r.json()
    assert created_like['detail'] == 'You do not have permission to do this action'
    assert likes_after == likes_before

def test_create_like_post_not_found(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    data = {'user_id': user_id, 'post_id': -1}

    r = client.post(
        '/likes/',
        headers=logged_user_token_headers,
        json=data
    )

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert r.status_code == 404
    created_like = r.json()
    assert created_like['detail'] == 'Post not found.'
    assert likes_after == likes_before

def test_create_like_not_logged_usr(
    client: TestClient, db: Session
) -> None:
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    data = {'user_id': user_id, 'post_id': post_test.id}

    r = client.post(
        '/likes/',
        headers={},
        json=data
    )

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert r.status_code == 401
    created_like = r.json()
    assert created_like["detail"] == "Not authenticated"
    assert likes_after == likes_before

def test_create_like_post_prev_liked(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    data = {'user_id': user_id, 'post_id': post_test.id}

    r = client.post(
        '/likes/',
        headers=logged_user_token_headers,
        json=data
    )

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert r.status_code == 200
    created_like = r.json()

    assert created_like['message'] == 'Post liked successfully'
    assert likes_after == likes_before + 1

def test_delete_like_current_usr_not_owner(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    r = client.delete(
        f'/likes/{post_test.id}&{-1}',
        headers=logged_user_token_headers,
    )

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert r.status_code == 403
    deleted_like = r.json()
    assert deleted_like['detail'] == 'You do not have permission to do this action'
    assert likes_after == likes_before

def test_delete_like_post_not_found(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    r = client.delete(
        f'/likes/{-1}&{user_id}',
        headers=logged_user_token_headers,
    )

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert r.status_code == 404
    deleted_like = r.json()
    assert deleted_like['detail'] == 'Post not found.'
    assert likes_after == likes_before

def test_delete_like_not_logged_usr(
    client: TestClient, db: Session
) -> None:
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    r = client.delete(
        f'/likes/{post_test.id}&{user_id}',
        headers={},
    )

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert r.status_code == 401
    deleted_like = r.json()
    assert deleted_like["detail"] == "Not authenticated"
    assert likes_after == likes_before

def test_delete_like(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    r = client.delete(
        f'/likes/{post_test.id}&{user_id}',
        headers=logged_user_token_headers,
    )

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert r.status_code == 200
    deleted_like = r.json()
    assert deleted_like['message'] == 'Post unliked successfully'
    assert likes_after == likes_before - 1