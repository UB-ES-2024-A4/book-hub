""" Post related CRUD methods """
from typing import Any
from sqlmodel import Session, select
from app.models import Post, PostCreate

def create_post(*, session: Session, post_create: PostCreate) -> Post:
    post = Post.model_validate(post_create)

    session.add(post)
    session.commit()
    session.refresh(post)
    return post