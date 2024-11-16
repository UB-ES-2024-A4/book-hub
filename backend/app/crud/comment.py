""" Comment related CRUD methods """
from typing import Any
from sqlmodel import Session, select
from app.models import Post, Comment

def create_comment(*, session: Session, comment_create: Comment) -> Comment:
    comment: Comment = Comment(user_id=comment_create.user_id, post_id=comment_create.post_id, comment=comment_create.comment, created_at=comment_create.created_at)

    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment