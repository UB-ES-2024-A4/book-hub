""" Post related CRUD methods """
from typing import Any
from sqlmodel import Session, select
from app.models import Post, PostCreate, PostUpdate

def create_post(*, session: Session, post_create: PostCreate) -> Post:
    post = Post.model_validate(post_create)

    session.add(post)
    session.commit()
    session.refresh(post)
    return post

def update_post(*, session: Session, post_update: PostUpdate, db_post: Post) -> Post:
    post_data = post_update.model_dump(exclude_unset=True)
    db_post.sqlmodel_update(post_data)
    session.add(db_post)
    session.commit()
    session.refresh(db_post)
    return db_post