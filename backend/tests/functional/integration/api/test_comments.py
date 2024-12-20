from app.models.post import Post
from fastapi.testclient import TestClient

from datetime import datetime
from app.models import User, Comment, BookCreate, PostCreate
from sqlmodel import Session, select

from app.crud.book import create_book
from app.crud.post import create_post


comment_text = "TEST_COMMENT"

def get_test_parameters(db: Session):

    user_test = db.exec(
        select(User).where(User.username == 'TEST_NAME')
    ).first()

    post_test = db.exec(select(Post)).first()
    try:    
        return user_test, post_test.id
    except:
        return user_test, None

def test_delete_wrong_comment_id(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    
    book = create_book(session=db, book_create=BookCreate(title="TEST_BOOK1111", author="TEST_AUTHOR1111", description="test", created_at=datetime.now()))
    
    user_test, _ = get_test_parameters(db)
    post_test = create_post(session=db, post_create=PostCreate(book_id=book.id, user_id=user_test.id, description="TEST_DESCRIPTION"))
    
    r = client.delete(
        "/comments/-1",
        headers=logged_user_token_headers
    )

    assert r.status_code == 404
    assert r.json()['detail'] == "Comment not found."

def test_delete_comment(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    
    user, post_id = get_test_parameters(db)
    r = client.get("users/me", headers=logged_user_token_headers)

    user_id = r.json()['id']
    
    db.add(Comment(user_id=user_id, post_id=post_id, comment=comment_text))

    comment = db.exec(select(Comment).where(Comment.user_id == user_id)).first()

    r = client.delete(
        f"/comments/{comment.id}",
        headers=logged_user_token_headers
    )

    assert r.status_code == 200
    assert r.json()['id'] == comment.id
    assert db.exec(select(Comment).where(Comment.id == comment.id)).one_or_none() == None

def test_delete_comment_not_logged_usr(
    client: TestClient, db: Session
) -> None:
    r = client.delete(
        "/comments/1"
    )

    assert r.status_code == 401
    assert r.json()['detail'] == "Not authenticated"

def test_create_comment_empty(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:

    _, post = get_test_parameters(db)

    data = {
        "comment": "",
        "post_id": post
    }

    r = client.post(
        "/comments/",
        headers=logged_user_token_headers,
        json=data
    )

    assert r.status_code == 400
    assert r.json()['detail'] == "Comment cannot be empty."

def test_create_comment_wrong_post(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:

    data = {
        "comment": comment_text,
        "post_id": -1
    }

    r = client.post(
        "/comments/",
        headers=logged_user_token_headers,
        json=data
    )

    assert r.status_code == 404
    assert r.json()['detail'] == "Post not found."

def test_create_comment(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:

    user, post_id = get_test_parameters(db)

    data = {
        "comment": comment_text,
        "post_id": post_id
    }

    r = client.post(
        "/comments/",
        headers=logged_user_token_headers,
        json=data
    )

    assert r.status_code == 200
    assert r.json()['comment'] == comment_text

def test_get_comments_wrong_post(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:

    r = client.get("/comments/-1", headers=logged_user_token_headers)

    assert r.status_code == 404
    assert r.json()['detail'] == "Post not found."

def test_get_comments(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:

    user, post_id = get_test_parameters(db)

    db.add(Comment(user_id=user.id, post_id=post_id, comment=comment_text))
    db.commit()

    comment = db.exec(select(Comment).where(Comment.user_id == user.id and Comment.comment == comment_text)).first()

    r = client.get(f"/comments/{post_id}", headers=logged_user_token_headers)

    assert r.status_code == 200
    for i in r.json():
        if i['id'] == comment.id:
            assert i['comment'] == comment_text
            break

