from fastapi.testclient import TestClient

from app.models import User, Book, PostCreate
from sqlmodel import Session, select, text
from datetime import datetime
from app.core.config import settings
from app import crud

description = 'a'
likes = 1
created_at = datetime.now()

def get_test_parameters(db: Session):
    user_test = db.exec(
        select(User).where(User.username == 'TEST_NAME')
    ).first()

    book_test = db.exec(
        select(Book).where(Book.title == 'TEST')
    ).first()

    return user_test.id, book_test.id

def test_create_post_with_likes(
    client: TestClient, db: Session
) -> None:
    user_id, book_id = get_test_parameters(db)

    data = {'user_id': user_id, 'book_id': book_id, 'description': description, 'likes': likes, 'created_at': f'{created_at}'}

    r = client.post(
        "/posts/",
        json=data    
    )
    
    created_post = r.json()

    assert r.status_code == 400
    assert created_post['detail'] == 'Created post must have 0 likes.'

def test_create_post_user_not_found(
    client: TestClient, db: Session
) -> None:
    user_id, book_id = get_test_parameters(db)

    data = {'user_id': -1, 'book_id': book_id, 'description': description, 'created_at': f'{created_at}'}

    r = client.post(
        "/posts/",
        json=data    
    )
    
    created_post = r.json()

    assert r.status_code == 404
    assert created_post['detail'] == 'User not found.'

def test_create_post_book_not_found(
    client: TestClient, db: Session
) -> None:
    user_id, book_id = get_test_parameters(db)

    data = {'user_id': user_id, 'book_id': -1, 'description': description, 'created_at': f'{created_at}'}

    r = client.post(
        "/posts/",
        json=data    
    )
    
    created_post = r.json()

    assert r.status_code == 404
    assert created_post['detail'] == 'Book not found.'

def test_create_post(
    client: TestClient, db: Session
) -> None:
    user_id, book_id = get_test_parameters(db)

    data = {'user_id': user_id, 'book_id': book_id, 'description': description, 'created_at': f'{created_at}'}

    r = client.post(
        "/posts/",
        json=data    
    )
    
    created_post = r.json()

    assert r.status_code == 200
    assert created_post['message'] == 'Post created successfully'
    assert created_post['data']['user_id'] == user_id
    assert created_post['data']['book_id'] == book_id
    assert created_post['data']['description'] == description
    assert created_post['data']['likes'] == 0

def test_update_post_not_found(
    client: TestClient, db: Session
) -> None:
    data = {'description': 'b'}

    r = client.put(
        f'/posts/-1',
        json=data
    )

    updated_post = r.json()
    assert r.status_code == 404
    assert updated_post['detail'] == "Post not found."

def test_update_post(
    client: TestClient, db: Session
) -> None:
    user_id, book_id = get_test_parameters(db)
    new_description = 'b'

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    created_post = crud.post.create_post(session=db, post_create=post_in)

    data = {'description': new_description}
    
    r = client.put(
        f"/posts/{created_post.id}",
        json=data    
    )
    
    created_post = r.json()

    assert r.status_code == 200
    assert created_post['message'] == 'Post updated successfully'
    assert created_post['data']['description'] == new_description




