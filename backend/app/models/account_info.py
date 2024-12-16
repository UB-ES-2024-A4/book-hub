import json
from sqlmodel import Session
from sqlalchemy import text
from typing import List
from app.models.comment import CommentOutHome
from app.models.book import Book
from app.models.post import PostOutHomeOnly, PostOutHome
from app.models.user import UserOutHome

class PostRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_user_posts_with_comments(
        self, user_id: int, user_id_acc: int
    ) -> List[PostOutHome]:
        
        comments_query = text("""
                WITH follower_info AS (
                    SELECT 
                        CASE 
                            WHEN :user_id IS NULL THEN FALSE  -- Si user_id es NULL, is_following = FALSE
                            WHEN f.follower_id = :user_id THEN TRUE 
                            ELSE FALSE 
                        END AS is_following
                    FROM 
                        followers f
                    WHERE 
                        f.followee_id = :user_id_acc
                )
                SELECT 
                    c.post_id,
                    c.id AS comment_id,
                    c.user_id AS commenter_id,
                    u.username AS commenter_username,
                    c.comment,
                    c.created_at,
                    fi.is_following
                FROM 
                    comment c
                JOIN 
                    post p ON c.post_id = p.id
                JOIN 
                    user u ON c.user_id = u.id
                LEFT JOIN 
                    follower_info fi ON TRUE -- Always devuelve el estado de isFollower
                WHERE 
                    p.user_id = :user_id_acc
                ORDER BY 
                    c.created_at ASC;

        """)

        posts_query = text("""
                        WITH likes_info AS (
                SELECT 
                    p.id AS post_id,
                    CASE 
                        WHEN :user_id IS NULL THEN FALSE  -- Si user_id es NULL, user_liked = FALSE
                        WHEN l.user_id = :user_id THEN TRUE 
                        ELSE FALSE 
                    END AS user_liked
                FROM 
                    post p
                LEFT JOIN 
                    `like` l ON p.id = l.post_id AND l.user_id = :user_id
            ), 
            post_filters AS (
                SELECT 
                    pf.post_id,
                    GROUP_CONCAT(DISTINCT pf.filter_id) AS filters
                FROM 
                    postfilter pf
                GROUP BY 
                    pf.post_id
            ),
            follower_info AS (
                SELECT 
                    CASE 
                        WHEN :user_id IS NULL THEN FALSE  -- Si user_id es NULL, is_following = FALSE
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
                b.id AS book_id,
                b.title AS book_title,
                b.author AS book_author,
                b.description AS book_description,
                b.created_at AS book_created_at,
                pf.filters
            FROM 
                post p
            JOIN 
                user u ON p.user_id = u.id
            LEFT JOIN 
                likes_info li ON p.id = li.post_id
            LEFT JOIN 
                follower_info fi ON TRUE -- Always devuelve el estado de isFollower
            LEFT JOIN 
                book b ON p.book_id = b.id
            LEFT JOIN 
                post_filters pf
                ON p.id = pf.post_id
            WHERE 
                p.user_id = :user_id_acc
            ORDER BY 
                p.created_at DESC;
        """)

        result = self.session.exec(
            posts_query, params={"user_id": user_id, "user_id_acc": user_id_acc}
        ).fetchall()

        posts = {}
        for row in result:
            post_id = row.post_id
            if post_id not in posts:
                posts[post_id] = PostOutHome(
                    user=UserOutHome(id=row.author_id, username=row.author_username, following=row.is_following if row.is_following else False),
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
                    filters=[int(fid) for fid in row.filters.split(",")] if row.filters else [],
                )


        comments_ = self.session.exec(
            comments_query, params={"user_id": user_id, "user_id_acc": user_id_acc}
        ).fetchall()

        commentsids = set()

        for comment in comments_:
            if comment.comment_id in commentsids:
                continue
            posts[comment.post_id].comments.append(
                CommentOutHome(
                    id=comment.comment_id,
                    user=UserOutHome(id=comment.commenter_id, username=comment.commenter_username),
                    comment=comment.comment,
                    created_at=comment.created_at,
                )
            )
            commentsids.add(comment.comment_id)
            posts[comment.post_id].n_comments += 1


        return list(posts.values())
