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

def get_all_comments_by_post(*, session: Session, post_id: int) -> Any:
    comments = session.exec(select(Comment).where(Comment.post_id == post_id)).all()
    return comments

def delete_comment(*, session: Session, db_comment: Comment) -> Comment:
    session.delete(db_comment)
    session.commit()
    return db_comment