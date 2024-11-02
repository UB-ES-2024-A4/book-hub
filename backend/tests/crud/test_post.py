from fastapi.encoders import jsonable_encoder
from sqlmodel import Session
from datetime import datetime

from app import crud
from app.models import Post, PostCreate, PostUpdate

book_id = 1
user_id = 1
description = 'a'
likes = 1
created_at = datetime.now()

def test_create_post(db: Session) -> None:
    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    created_post = crud.post.create_post(session=db, post_create=post_in)

    assert created_post.book_id == book_id
    assert created_post.user_id == user_id
    assert created_post.description == description
    assert created_post.likes == 0

def test_update_post(db: Session) -> None:
    new_description = 'b'

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    created_post = crud.post.create_post(session=db, post_create=post_in)
    
    post_in = PostUpdate(description=new_description)
    db_post : Post = db.get(Post, created_post.id)

    updated_post = crud.post.update_post(session=db, post_update=post_in, db_post=db_post)
    assert updated_post.description == new_description

def test_delete_post(db: Session) -> None:
    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    created_post = crud.post.create_post(session=db, post_create=post_in)
    
    db_post : Post = db.get(Post, created_post.id)

    deleted_post = crud.post.delete_post(session=db, db_post=db_post)
    assert deleted_post

def test_get_post(db: Session) -> None:
    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    created_post = crud.post.create_post(session=db, post_create=post_in)

    post = crud.post.get_post(session=db, post_id=created_post.id)

    assert post.book_id == book_id
    assert post.user_id == user_id
    assert post.description == description
    assert post.likes == 0

def test_get_all_posts(db: Session) -> None:
    post_in1 = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    crud.post.create_post(session=db, post_create=post_in1)

    post_in2 = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    crud.post.create_post(session=db, post_create=post_in2)

    all_posts = crud.post.get_all_posts(session=db)

    assert len(all_posts) > 1
    for item in all_posts:
        assert item.book_id
        assert item.user_id
        assert item.description
        assert item.created_at
        assert item.likes >= 0

def test_get_posts_by_book_id(db: Session) -> None:
    post_in1 = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    crud.post.create_post(session=db, post_create=post_in1)

    post_in2 = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    crud.post.create_post(session=db, post_create=post_in2)

    all_posts = crud.post.get_posts_by_book_id(session=db, book_id=book_id)

    assert len(all_posts) > 1
    for item in all_posts:
        assert item.book_id == book_id
        assert item.user_id
        assert item.description
        assert item.created_at
        assert item.likes >= 0

def test_get_posts_by_user_id(db: Session) -> None:
    post_in1 = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    crud.post.create_post(session=db, post_create=post_in1)

    post_in2 = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    crud.post.create_post(session=db, post_create=post_in2)

    all_posts = crud.post.get_posts_by_user_id(session=db, user_id=user_id)

    assert len(all_posts) > 1
    for item in all_posts:
        assert item.book_id
        assert item.user_id == user_id
        assert item.description
        assert item.created_at
        assert item.likes >= 0

