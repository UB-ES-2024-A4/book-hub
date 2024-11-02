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


#    db_post : Post = session.get(Post, post_id)
def test_update_post(db: Session) -> None:
    new_description = 'b'

    post_in = PostCreate(book_id=book_id, user_id=user_id, description=description, created_at=created_at)
    created_post = crud.post.create_post(session=db, post_create=post_in)
    
    post_in = PostUpdate(description=new_description)
    db_post : Post = db.get(Post, created_post.id)

    updated_post = crud.post.update_post(session=db, post_update=post_in, db_post=db_post)
    assert updated_post.description == new_description


