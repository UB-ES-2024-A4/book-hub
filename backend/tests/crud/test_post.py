from fastapi.encoders import jsonable_encoder
from sqlmodel import Session
from datetime import datetime

from app import crud
from app.models import (Post, PostCreate)

book_id = 1
user_id = 1
description = 'a'
likes = 1
created_at = datetime.now()

def test_create_post(db: Session) -> None:
    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    post = crud.post.create_post(session=db, post_create=post_in)
    assert post.book_id == book_id
    assert post.user_id == user_id
    assert post.description == description
    assert post.likes == 0