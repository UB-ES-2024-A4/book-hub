from sqlmodel import SQLModel, Field, Session
from sqlalchemy import text
from typing import Optional, List
from datetime import datetime
from app.models.comment import CommentOutHome
from app.models.book import Book
from app.models.post import PostOutHomeOnly, PostOutHome
from app.models.user import UserOutHome

class CommentOut(SQLModel):
    id: int
    user: UserOutHome
    comment: str
    created_at: datetime


class PostRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_user_posts_with_comments(
        self, user_id: int, user_id_acc: int
    ) -> List[PostOutHome]:
        query = text("""
            WITH comments_with_post AS (
                SELECT 
                    c.post_id,
                    c.id AS comment_id,
                    c.user_id AS commenter_id,
                    u.username AS commenter_username,
                    c.comment,
                    c.created_at
                FROM 
                    comment c
                JOIN 
                    user u ON c.user_id = u.id
            ),
            likes_info AS (
                SELECT 
                    p.id AS post_id,
                    CASE 
                        WHEN l.user_id = :user_id THEN TRUE 
                        ELSE FALSE 
                    END AS user_liked
                FROM 
                    post p
                LEFT JOIN 
                    `like` l ON p.id = l.post_id AND l.user_id = :user_id
            ),
            follower_info AS (
                SELECT 
                    CASE 
                        WHEN f.follower_id = :user_id THEN TRUE 
                        ELSE FALSE 
                    END AS is_following
                FROM 
                    followers f
                WHERE 
                    f.followee_id = :user_id_acc
            )
            SELECT 
                p.id AS post_id,
                p.user_id AS author_id,
                u.username AS author_username,
                p.likes AS post_likes,
                p.created_at AS post_created_at,
                p.description AS post_description,
                li.user_liked,
                fi.is_following,
                cw.comment_id,
                cw.commenter_id,
                cw.commenter_username,
                cw.comment,
                cw.created_at AS comment_created_at,
                b.id AS book_id,
                b.title AS book_title,
                b.author AS book_author,
                b.description AS book_description,
                b.created_at AS book_created_at
            FROM 
                post p
            JOIN 
                user u ON p.user_id = u.id
            LEFT JOIN 
                likes_info li ON p.id = li.post_id
            LEFT JOIN 
                follower_info fi ON TRUE -- Always return the following info
            LEFT JOIN 
                comments_with_post cw ON p.id = cw.post_id
            LEFT JOIN 
                book b ON p.book_id = b.id
            WHERE 
                p.user_id = :user_id_acc
            ORDER BY 
                p.created_at DESC, 
                cw.created_at ASC;
        """)

        result = self.session.execute(
            query, {"user_id": user_id, "user_id_acc": user_id_acc}
        ).fetchall()

        posts = {}
        for row in result:
            post_id = row.post_id
            if post_id not in posts:
                posts[post_id] = PostOutHome(
                    user=UserOutHome(id=row.author_id, username=row.author_username, following=row.is_following),
                    post=PostOutHomeOnly(
                        id=row.post_id,
                        likes=row.post_likes,
                        description=row.post_description,  # Asume que no hay descripción en la tabla post
                        created_at=row.post_created_at,
                    ),
                    like_set=row.user_liked,
                    book=Book(
                        id=row.book_id,
                        title=row.book_title,
                        author=row.book_author,
                        description=row.book_description,
                        created_at=row.book_created_at,
                    ),
                    n_comments=0,
                    comments=[],
                    filters=[],  # Asume que los filtros no están en esta consulta
                )

            if row.comment_id is not None:
                comment = CommentOutHome(
                    id=row.comment_id,
                    user=UserOutHome(
                        id=row.commenter_id, 
                        username=row.commenter_username
                    ),
                    comment=row.comment,
                    created_at=row.comment_created_at,
                )
                posts[post_id].comments.append(comment)
                posts[post_id].n_comments += 1

        return list(posts.values())
