from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select
from datetime import datetime

from app import crud
from app.models import Like, User, Book, Post
from tests.utils import check_quantity_likes

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

def test_create_like(db: Session):
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    like_in = Like(user_id=user_id, post_id=post_test.id)
    created_like = crud.like.create_like(session=db, like_create=like_in)
    
    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert created_like.user_id == user_id
    assert created_like.post_id == post_test.id
    assert likes_after == likes_before + 1

def test_delete_like(db: Session):
    user_id, post_test = get_test_parameters(db)
    likes_before = post_test.likes

    db_like : Like = db.exec(
        select(Like).where(Like.post_id == post_test.id and Like.user_id == user_id)
    ).first()

    deleted_like = crud.like.delete_like(session=db, db_like=db_like)

    likes_after = check_quantity_likes(post_test=post_test, db=db)

    assert deleted_like.user_id == user_id
    assert deleted_like.post_id == post_test.id
    assert likes_after == likes_before - 1