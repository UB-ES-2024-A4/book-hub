from fastapi.testclient import TestClient

from app.models import User, UserCreate, Book, Post, Comment
from sqlmodel import Session, select, text
from datetime import datetime
from app.core.config import settings
from app import crud

comment = 'test_comment'
created_at = datetime.now()

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

    return user_test.id, post_test.id

def test_create_comment_current_usr_not_owner(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_id = get_test_parameters(db)

    data = {'user_id': -1, 'post_id': post_id, 'comment': comment, 'created_at': f'{created_at}'}

    r = client.post(
        '/comments/',
        headers=logged_user_token_headers,
        json=data
    )

    assert r.status_code == 403
    created_comment = r.json()
    assert created_comment['detail'] == 'You do not have permission to do this action'

def test_create_comment_post_not_found(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_id = get_test_parameters(db)

    data = {'user_id': user_id, 'post_id': -1, 'comment': comment, 'created_at': f'{created_at}'}

    r = client.post(
        '/comments/',
        headers=logged_user_token_headers,
        json=data
    )

    assert r.status_code == 404
    created_comment = r.json()
    assert created_comment['detail'] == 'Post not found.'

def test_create_comment_not_logged_user(
    client: TestClient, db: Session
) -> None:
    user_id, post_id = get_test_parameters(db)

    data = {'user_id': user_id, 'post_id': post_id, 'comment': comment, 'created_at': f'{created_at}'}

    r = client.post(
        '/comments/',
        headers={},
        json=data
    )

    assert r.status_code == 401
    created_comment = r.json()
    assert created_comment['detail'] == "Not authenticated"

def test_create_comment(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_id = get_test_parameters(db)

    data = {'user_id': user_id, 'post_id': post_id, 'comment': comment, 'created_at': f'{created_at}'}

    r = client.post(
        '/comments/',
        headers=logged_user_token_headers,
        json=data
    )

    assert r.status_code == 200
    created_comment = r.json()
    assert created_comment['message'] == "Comment created successfully"
    assert created_comment['data']['user_id'] == user_id
    assert created_comment['data']['post_id'] == post_id
    assert created_comment['data']['comment'] == comment

