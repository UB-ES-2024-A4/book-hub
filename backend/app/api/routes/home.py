from app import crud
from app.api.deps import get_current_user
from app.core.database import get_session
from app.models.book import Book
from app.models.comment import CommentOutHome
from app.models.post import PostOutHome, PostOutHomeOnly, testtest
from app.models.user import User, UserOutHome
from fastapi import (APIRouter, HTTPException, Depends)
from pymysql import NULL
from sqlmodel import Session
from sqlalchemy.sql import text

router = APIRouter()


@router.post("/",
              response_model=list[PostOutHome],
              dependencies=[Depends(get_session)]
              )
def get_home_posts(skip: int = 0,
                    limit : int = 0,
                    filters: list[int] = [],
                    user: User = Depends(get_current_user),
                    session: Session = Depends(get_session)):
    comments_query = text(""" 
SELECT 
    c.post_id,
    c.id AS comment_id,
    c.user_id AS commenter_id,
    cu.username AS commenter_username,
    c.comment,
    c.created_at,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM followers f
            WHERE f.follower_id = :follower_id AND f.followee_id = c.user_id
        ) THEN TRUE 
        ELSE FALSE 
    END AS is_following_commenter
FROM 
    comment c
JOIN 
    user cu 
    ON c.user_id = cu.id
WHERE 
    c.post_id IN (
        SELECT p.id 
        FROM post p
        JOIN followers f 
        ON p.user_id = f.followee_id
        WHERE f.follower_id = :follower_id
    )
ORDER BY 
    c.post_id, c.created_at DESC;
            """)

    posts_query = text("""
               WITH latest_comments AS (
        SELECT 
        c.post_id,
        c.id AS comment_id,
        c.user_id AS commenter_id,
        cu.username AS commenter_username,
        c.comment,
        c.created_at,
        ROW_NUMBER() OVER (PARTITION BY c.post_id ORDER BY c.created_at DESC) AS row_num
    FROM 
        comment c
    JOIN 
        user cu ON c.user_id = cu.id
),
comment_counts AS (
    SELECT 
        post_id,
        COUNT(*) AS total_comments
    FROM 
        comment
    GROUP BY 
        post_id
),
post_filters AS (
    SELECT 
        pf.post_id,
        GROUP_CONCAT(DISTINCT pf.filter_id) AS filters
    FROM 
        postfilter pf
    GROUP BY 
        pf.post_id
)
-- Query to get posts
SELECT 
    u.id AS user_id,
    u.username,
    p.id AS post_id,
    p.description AS post_description, 
    p.likes AS likes,
    p.created_at,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM `like` l
            WHERE l.post_id = p.id AND l.user_id = :follower_id
        ) THEN TRUE 
        ELSE FALSE 
    END AS like_set,
    b.id AS book_id,
    b.title AS book_title,
    b.author AS book_author,
    b.created_at AS book_created_at,
    pf.filters,
    cc.total_comments AS num_comments
FROM 
    post p
JOIN 
    user u
    ON p.user_id = u.id
JOIN 
    followers f 
    ON p.user_id = f.followee_id
JOIN
    book b
    ON p.book_id = b.id
LEFT JOIN 
    comment_counts cc 
    ON p.id = cc.post_id
LEFT JOIN 
    post_filters pf
    ON p.id = pf.post_id
WHERE 
    f.follower_id = :follower_id
    AND ( -- Filter by filters and if filters is null, return all posts
        :filters = ""
        OR p.id IN (
            SELECT DISTINCT post_id 
            FROM postfilter 
            WHERE filter_id IN (:filters)
        )
    )
ORDER BY 
    p.created_at DESC
LIMIT :limit OFFSET :skip;

        """)
    
    filters = ",".join([str(f) for f in filters])

    # Execute posts query
    posts_result = session.exec(
        posts_query, 
        params={"follower_id": user.id, "filters": filters, "skip": skip, "limit": limit}
    ).fetchall()

    # Execute comments query
    comments_result = session.exec(
        comments_query, 
        params={"follower_id": user.id}
    ).fetchall()

    # Process posts
    posts = {}
    for row in posts_result:
        post_id = row.post_id
        posts[post_id] = PostOutHome(
            user=UserOutHome(id=row.user_id, username=row.username, following=True),
            post=PostOutHomeOnly(
                id=row.post_id,
                likes=row.likes,
                description=row.post_description,
                created_at=row.created_at,
            ),
            like_set=row.like_set,
            book=Book(
                id=row.book_id,
                title=row.book_title,
                author=row.book_author,
                created_at=row.book_created_at,
            ),
            n_comments=row.num_comments if row.num_comments else 0,
            comments=[],
            filters=[int(fid) for fid in row.filters.split(",") if row.filters],
        )

    # Process comments
    for row in comments_result:
        post_id = row.post_id
        if post_id in posts:
            comment = CommentOutHome(
                id=row.comment_id,
                user=UserOutHome(id=row.commenter_id, username=row.commenter_username, following=row.is_following_commenter),
                comment=row.comment,
                created_at=row.created_at,
            )
            posts[post_id].comments.append(comment)

    return list(posts.values())