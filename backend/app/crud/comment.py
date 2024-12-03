from app.models.comment import CommentOutHome
from app.models.post import Post
from sqlalchemy.sql import text
from datetime import datetime
from sqlmodel import Session, select
from app.models import (
    Comment, 
    CommentCreate,
    UserOutHome,
    User
)
import app.utils as utils

def create_comment(session: Session, comment: CommentCreate, user: User) -> Comment:

    # Check if user and post exists
    utils.post_exists_in_database(session=session, post_id=comment.post_id)
    if comment.comment == "": raise ValueError(400, "Comment cannot be empty.") 

    # If created_at is not provided, set it to current time
    if not comment.created_at: comment.created_at = datetime.now()

    new_comment = Comment(**comment.model_dump(), user_id=user.id)
    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)
    return new_comment

def get_post_comments(session: Session, post_id: int, user: User | None = None) -> list[CommentOutHome]:
    
    utils.post_exists_in_database(session=session, post_id=post_id)

    comments_query = text("""
                    SELECT 
                        c.id AS comment_id,
                        c.comment,
                        c.created_at,
                        u.id AS user_id,
                        u.username,
                        CASE 
                            WHEN :current_user_id IS NOT NULL AND EXISTS (
                                SELECT 1 
                                FROM followers f 
                                WHERE f.followee_id = u.id AND f.follower_id = :current_user_id
                            ) THEN TRUE 
                            WHEN :current_user_id IS NULL THEN NULL
                            ELSE FALSE 
                        END AS following
                    FROM 
                        comment c
                    JOIN 
                        user u ON c.user_id = u.id
                    WHERE 
                        c.post_id = :post_id
                    ORDER BY 
                        c.created_at DESC;
                    """)    
    comments_db = session.exec(
        comments_query,
        params={"post_id": post_id, "current_user_id": user.id}
    ).all()

    comments = [CommentOutHome(
        id=comment_id,
        comment=comment,
        created_at=created_at,
        user=UserOutHome(
            id=user_id,
            username=username,
            following=following == 1
        )
    ) for comment_id, comment, created_at, user_id, username, following in comments_db]

    return comments


def delete_comment(session: Session, comment_id: int, user: User) -> Comment:
    comment = session.get(Comment, comment_id)
    if not comment: raise ValueError(404, "Comment not found.")
    if comment.user_id != user.id: raise ValueError(403, "You are not the owner of this comment.")
    session.delete(comment)
    session.commit()
    return comment