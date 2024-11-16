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

def test_get_comments_post_not_found(
    client: TestClient, db: Session
) -> None:
    r = client.get(
        f'/comments/{-1}',
    )

    assert r.status_code == 404
    retrieved_comment = r.json()
    assert retrieved_comment['detail'] == 'Post not found.'

def test_get_comments(
       client: TestClient, db: Session
) -> None:
    user_id, post_id = get_test_parameters(db)

    comment_in = Comment(user_id=user_id, post_id=post_id, comment=comment, created_at=created_at)
    crud.comment.create_comment(session=db, comment_create=comment_in)

    r = client.get(
        f'/comments/{post_id}',
    )

    assert r.status_code == 200
    retrieved_comments = r.json()

    for item in retrieved_comments:
        assert item['post_id'] == post_id
        assert item['user_id']
        assert item['comment']
        assert item['created_at']

def test_delete_comment_not_found(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:

    r = client.delete(
        f'/comments/{-1}',
        headers=logged_user_token_headers,
    )

    assert r.status_code == 404
    deleted_comment = r.json()
    assert deleted_comment['detail'] == 'Comment not found.'

def test_delete_comment_current_usr_not_owner(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_id = get_test_parameters(db)

    user_in = UserCreate(email='test_comment', username='test_comment', first_name='test_comment', last_name='test_comment', password='test_comment')
    user2 = crud.user.create_user(session=db, user_create=user_in)

    comment_in = Comment(user_id=user2.id, post_id=post_id, comment=comment, created_at=created_at)
    created_comment = crud.comment.create_comment(session=db, comment_create=comment_in)

    r = client.delete(
        f'/comments/{created_comment.id}',
        headers=logged_user_token_headers,
    )

    assert r.status_code == 403
    deleted_comment = r.json()
    assert deleted_comment['detail'] == 'You do not have permission to do this action'

def test_delete_comment_not_logged_user(
    client: TestClient, db: Session
) -> None:
    user_id, post_id = get_test_parameters(db)

    comment_in = Comment(user_id=user_id, post_id=post_id, comment=comment, created_at=created_at)
    created_comment = crud.comment.create_comment(session=db, comment_create=comment_in)

    r = client.delete(
        f'/comments/{created_comment.id}',
        headers={},
    )

    assert r.status_code == 401
    deleted_comment = r.json()
    assert deleted_comment['detail'] == "Not authenticated"

def test_delete_comment(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, post_id = get_test_parameters(db)

    comment_in = Comment(user_id=user_id, post_id=post_id, comment=comment, created_at=created_at)
    created_comment = crud.comment.create_comment(session=db, comment_create=comment_in)

    r = client.delete(
        f'/comments/{created_comment.id}',
        headers=logged_user_token_headers,
    )

    assert r.status_code == 200
    created_comment = r.json()
    assert created_comment['message'] == "Comment deleted successfully"
    assert created_comment['data']['user_id'] == user_id
    assert created_comment['data']['post_id'] == post_id
    assert created_comment['data']['comment'] == comment