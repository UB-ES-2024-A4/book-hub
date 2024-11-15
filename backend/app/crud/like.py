""" Like related CRUD methods """
from typing import Any
from sqlmodel import Session, select
from app.models import Like

# Like post
def create_like(*, session: Session, like_create: Like) -> Like:
    like = Like(user_id=like_create.user_id, post_id=like_create.post_id)

    session.add(like)
    session.commit()
    session.refresh(like)
    return like

# Unlike post
def delete_like(*, session: Session, db_like: Like) -> Like:
    session.delete(db_like)
    session.commit()
    return db_like