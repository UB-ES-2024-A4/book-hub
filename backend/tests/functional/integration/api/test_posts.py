from fastapi.testclient import TestClient

from app.models import User, Book, PostCreate, Filter
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

    filter_test = db.exec(
        select(Filter).where(Filter.name == 'TEST_FILTER')
    ).first()

    return user_test.id, book_test.id, filter_test.id


def get_test_parameters2(db: Session):
    user_test = db.exec(
        select(User).where(User.username == 'TEST_NAME2')
    ).first()

    book_test = db.exec(
        select(Book).where(Book.title == 'TEST')
    ).first()

    return user_test.id, book_test.id


def test_create_post_with_likes(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    data = {'user_id': user_id, 'book_id': book_id, 'description': description, 'likes': likes,
            'created_at': f'{created_at}'}

    r = client.post(
        "/posts/",
        headers=logged_user_token_headers,
        json=data
    )

    created_post = r.json()

    assert r.status_code == 400
    assert created_post['detail'] == 'Created post must have 0 likes.'


def test_create_post_user_not_found(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    data = {'user_id': -1, 'book_id': book_id, 'description': description, 'created_at': f'{created_at}'}

    r = client.post(
        "/posts/",
        headers=logged_user_token_headers,
        json=data
    )

    created_post = r.json()

    assert r.status_code == 404
    assert created_post['detail'] == 'User not found.'


def test_create_post_book_not_found(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    data = {'user_id': user_id, 'book_id': -1, 'description': description, 'created_at': f'{created_at}'}

    r = client.post(
        "/posts/",
        headers=logged_user_token_headers,
        json=data
    )

    created_post = r.json()

    assert r.status_code == 404
    assert created_post['detail'] == 'Book not found.'

def test_create_post_filter_not_found(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    data = {'user_id': user_id, 'book_id': book_id, 'description': description, 'created_at': f'{created_at}', 'filter_ids': [-1]}

    r = client.post(
        "/posts/",
        headers=logged_user_token_headers,
        json=data
    )

    created_post = r.json()

    assert r.status_code == 404
    assert created_post['detail'] == 'Filters duplicated or one or more filters not found'

def test_create_post(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    data = {'user_id': user_id, 'book_id': book_id, 'description': description, 'created_at': f'{created_at}', 'filter_ids': [filter_id]}

    r = client.post(
        "/posts/",
        headers=logged_user_token_headers,
        json=data
    )

    created_post = r.json()

    assert r.status_code == 200
    assert created_post['message'] == 'Post created successfully'
    assert created_post['post']['user_id'] == user_id
    assert created_post['post']['book_id'] == book_id
    assert created_post['post']['description'] == description
    assert created_post['post']['likes'] == 0


def test_create_post_not_logged_user(
        client: TestClient, db: Session
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    data = {'user_id': user_id, 'book_id': book_id, 'description': description, 'created_at': f'{created_at}', 'filter_ids': []}

    r = client.post(
        "/posts/",
        headers={},
        json=data
    )

    created_post = r.json()

    assert r.status_code == 401
    assert created_post["detail"] == "Not authenticated"


def test_update_post_not_found(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    data = {'description': 'b'}

    r = client.put(
        f'/posts/-1',
        headers=logged_user_token_headers,
        json=data
    )

    updated_post = r.json()
    assert r.status_code == 404
    assert updated_post['detail'] == "Post not found."


def test_update_post(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)
    new_description = 'b'

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    created_post = crud.post.create_post(session=db, post_create=post_in)

    data = {'description': new_description, 'filter_ids': [filter_id]}

    r = client.put(
        f"/posts/{created_post.id}",
        headers=logged_user_token_headers,
        json=data
    )

    created_post = r.json()

    assert r.status_code == 200
    assert created_post['message'] == 'Post updated successfully'
    assert created_post['post']['description'] == new_description

def test_update_post_filter_not_found(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)
    new_description = 'b'

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    created_post = crud.post.create_post(session=db, post_create=post_in)

    data = {'description': new_description, 'filter_ids': [-1]}

    r = client.put(
        f"/posts/{created_post.id}",
        headers=logged_user_token_headers,
        json=data
    )

    created_post = r.json()

    assert r.status_code == 404
    assert created_post['detail'] == 'Filters duplicated or one or more filters not found'

def test_update_post_not_logged_user(
        client: TestClient, db: Session
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)
    new_description = 'b'

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    created_post = crud.post.create_post(session=db, post_create=post_in)

    data = {'description': new_description}

    r = client.put(
        f"/posts/{created_post.id}",
        headers={},
        json=data
    )

    created_post = r.json()

    assert r.status_code == 401
    assert created_post["detail"] == "Not authenticated"


def test_update_post_not_owner(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id = get_test_parameters2(db)
    new_description = 'b'

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    created_post = crud.post.create_post(session=db, post_create=post_in)

    data = {'description': new_description}

    r = client.put(
        f"/posts/{created_post.id}",
        headers=logged_user_token_headers,
        json=data
    )

    created_post = r.json()

    assert r.status_code == 403
    assert created_post["detail"] == "You do not have permission to do this action"


def test_delete_post_not_found(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    r = client.delete(
        f'/posts/-1',
        headers=logged_user_token_headers,
    )

    updated_post = r.json()
    assert r.status_code == 404
    assert updated_post['detail'] == "Post not found."


def test_delete_post(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    created_post = crud.post.create_post(session=db, post_create=post_in)

    r = client.delete(
        f"/posts/{created_post.id}",
        headers=logged_user_token_headers,
    )

    created_post = r.json()

    assert r.status_code == 200
    assert created_post['message'] == 'Post deleted successfully'


def test_delete_post_not_logged_user(
        client: TestClient, db: Session
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    created_post = crud.post.create_post(session=db, post_create=post_in)

    r = client.delete(
        f"/posts/{created_post.id}",
        headers={},
    )

    created_post = r.json()

    assert r.status_code == 401
    assert created_post["detail"] == "Not authenticated"


def test_delete_post_not_owner(
        client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    user_id, book_id = get_test_parameters2(db)

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    created_post = crud.post.create_post(session=db, post_create=post_in)

    r = client.delete(
        f"/posts/{created_post.id}",
        headers=logged_user_token_headers,
    )

    created_post = r.json()

    assert r.status_code == 403
    assert created_post["detail"] == "You do not have permission to do this action"


def test_get_all_posts(
        client: TestClient, db: Session
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    crud.post.create_post(session=db, post_create=post_in)

    post_in2 = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    crud.post.create_post(session=db, post_create=post_in2)

    r = client.get(
        "/posts/all"
    )

    all_posts = r.json()

    assert r.status_code == 200

    for post in all_posts['posts']:
        assert 'book_id' in post['post']
        assert 'user_id' in post['post']
        assert 'description' in post['post']
        

def test_get_post_not_found_by_id(
        client: TestClient, db: Session
) -> None:
    r = client.get(
        f"/posts/-1",
    )

    assert r.status_code == 404
    assert r.json()["detail"] == "Post not found."


def test_get_post_by_id(
        client: TestClient, db: Session
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    post = crud.post.create_post(session=db, post_create=post_in)

    r = client.get(
        f'/posts/{post.id}'
    )

    assert r.status_code == 200
    retrieved_post = r.json()
    assert retrieved_post
    retrieved_post = retrieved_post['post']
    assert post.book_id == retrieved_post["book_id"]
    assert post.user_id == retrieved_post["user_id"]
    assert post.description == retrieved_post["description"]


def test_get_post_not_found_by_book_id(
        client: TestClient, db: Session
) -> None:
    r = client.get(
        f"/posts/book/-1",
    )

    assert r.status_code == 404
    assert r.json()["detail"] == "Book not found."


def test_get_post_by_book_id(
        client: TestClient, db: Session
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    crud.post.create_post(session=db, post_create=post_in)

    r = client.get(
        f'/posts/book/{book_id}'
    )

    assert r.status_code == 200
    retrieved_posts = r.json()
    for post in retrieved_posts['posts']:
        assert book_id == post['post']['book_id']


def test_get_post_not_found_by_user_id(
        client: TestClient, db: Session
) -> None:
    r = client.get(
        f"/posts/user/-1",
    )

    assert r.status_code == 404
    assert r.json()["detail"] == "User not found."


def test_get_post_by_user_id(
        client: TestClient, db: Session
) -> None:
    user_id, book_id, filter_id = get_test_parameters(db)

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at, filter_ids=[])
    crud.post.create_post(session=db, post_create=post_in)

    r = client.get(
        f'/posts/user/{user_id}'
    )

    assert r.status_code == 200
    retrieved_posts = r.json()
    for item in retrieved_posts['posts']:
        item['post']['user_id'] == user_id


def test_get_posts_empty(
        client: TestClient, db: Session
) -> None:
    try:
        db.execute(text('DELETE FROM post'))

        r = client.get(
            "/posts/all"
        )

        all_posts = r.json()

        assert r.status_code == 200
        assert all_posts['posts'] == []
    finally:
        db.rollback()



