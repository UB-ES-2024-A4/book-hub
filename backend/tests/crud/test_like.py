from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select
from datetime import datetime

from app import crud
from app.models import Like, User, Book, Post

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

def test_create_like(db: Session):
    user_id, post_id = get_test_parameters(db)

    like_in = Like(user_id=user_id, post_id=post_id)
    like = crud.like.create_like(session=db, like_create=like_in)

    assert like.user_id == user_id
    assert like.post_id == post_id