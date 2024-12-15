from app.models.account_info import CommentOut, PostRepository
from app.models.followers import Followers
from sqlalchemy.sql import text
from app.models.comment import CommentOutHome
from app.models.post import Post, PostOutHome, PostOutHomeOnly
from app.models.user import UserOutHome
from fastapi import HTTPException
from app.models import User, Book, Filter, Like, Post
from sqlmodel import Session, select

def check_email_name_length(username: str, first_name: str, last_name: str):
    max_length = 20
    min_length = 3

    if len(username) < min_length:
        raise HTTPException(
            status_code=400,
            detail="Username must contain at least 3 characters.",
        )
    
    if username.find(" ") != -1:
        raise HTTPException(
            status_code=400,
            detail="Username must not contain spaces."
        )

    if (len(username) > max_length or len(first_name) > max_length or len(last_name) > max_length):
        raise HTTPException(
            status_code=400,
            detail="Username, first name and last name must contain at most 20 characters.",
        )
    
def check_missing_fields(first_name: str, last_name: str):
    if (not first_name or not last_name):
        raise HTTPException(
            status_code=400,
            detail="First name and last name required.",
        )
    
def check_existence_email(email: str, session):
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()

    if session_user:
        raise HTTPException(
            status_code=400,
            detail="This email is already in use.",
        )
    
def check_existence_usrname(username: str, session):    
    statement = select(User).where(User.username == username)
    session_user = session.exec(statement).first()

    if session_user:
        raise HTTPException(
            status_code=400,
            detail="This username is already in use.",
        )
    
def check_pwd_length(password: str):
    if not (8 <= len(password) <= 28):
        raise HTTPException(
            status_code=400,
            detail="Password must contain between 8 and 28 characters.",
        )
    
def check_existence_book_user(book_id: int | None, user_id: int | None, session):
    if user_id:
        statement = select(User).where(User.id == user_id)
        session_user = session.exec(statement).first()

        if not session_user: 
            raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if book_id:
        statement = select(Book).where(Book.id == book_id)
        session_book = session.exec(statement).first()

        if not session_book: 
            raise HTTPException(
            status_code=404,
            detail="Book not found.",
        )

def check_quantity_likes(likes: int):
    if likes != 0:
        raise HTTPException(
            status_code=400,
            detail="Created post must have 0 likes.",
        )
    
def check_ownership(current_usr_id: int, check_usr_id: int):
    if current_usr_id != check_usr_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to do this action",
        )
    
def check_book_fields(title: str, author: str, description: str):
    if title == None or author == None or description == None or not title or not author or not description: 
        raise HTTPException(
            status_code=400,
            detail="Created book is missing parameters",
        )
    
def check_filters(filter_ids: list, session):
    filters = session.exec(select(Filter).where(Filter.id.in_(filter_ids))).all()

    if len(filters) != len(filter_ids):
        raise HTTPException(
            status_code=404, 
            detail="Filters duplicated or one or more filters not found"
        )
    
def user_exists_in_database(user_id: int, session: Session):
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user: raise ValueError("User not found.")
    
def post_exists_in_database(post_id: int, session: Session):
    post = session.exec(select(Post).where(Post.id == post_id)).first()
    if not post: raise ValueError(404, "Post not found.")


def check_post_liked(post_id: int, user_id: int, session, like: bool):
    statement = select(Like).where(Like.user_id == user_id and Like.post_id == post_id)
    user_like = session.exec(statement).first()

    if like and user_like != None:
        raise HTTPException(
            status_code=400,
            detail="Post was already liked.",
        )

    if not like and user_like == None:
        raise HTTPException(
            status_code=400,
            detail="This post doesn't have your like",
        )

def check_existence_post(post_id: int, session):
    post: Post = session.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found.",
        )

# Home utilities
def get_home_comments(*, 
                      session: Session,
                      user: User) -> list[CommentOutHome]:
    
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
    
    # Execute comments query
    comments_result = session.exec(
        comments_query, 
        params={"follower_id": user.id}
    ).fetchall()

    return comments_result

def get_home_posts(*, 
                   session: Session,
                   user: User,
                   filters: list[int],
                   skip: int,
                   limit: int) -> list[PostOutHome]:
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
                b.description AS book_description,
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
    
    # Execute posts query
    posts_result = session.exec(
        posts_query, 
        params={"follower_id": user.id, "filters": filters, "skip": skip, "limit": limit}
    ).fetchall()

    return posts_result

def get_home_posts_for_user(*, 
                       session: Session,
                       user: User,
                       filters: str,
                       skip: int,
                       limit: int) -> list[PostOutHome]:

    posts = get_home_posts(session=session,
                                 user=user,
                                 filters=filters,
                                 skip=skip,
                                 limit=limit)
    
    comments = get_home_comments(session=session, user=user)

    # Process posts to build PostOutHome objects
    # Comprehension list to build this dictionary faster
    posts = {row.post_id : PostOutHome(
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
                description=row.book_description,
                created_at=row.book_created_at,
            ),
            n_comments=row.num_comments if row.num_comments else 0,
            comments=[],
            filters=[int(fid) for fid in row.filters.split(",") if row.filters],
        ) for row in posts}
    
    # Now iterate the coments to add them to the corresponding post
    for row in comments:
        post_id = row.post_id
        if post_id in posts:
            comment = CommentOutHome(
                id=row.comment_id,
                user=UserOutHome(id=row.commenter_id, username=row.commenter_username, following=row.is_following_commenter),
                comment=row.comment,
                created_at=row.created_at,
            )
            posts[post_id].comments.append(comment)

    return list(posts.values()) # Return a list of PostOutHome objects



def get_explorer_posts_db(*, 
                   session: Session,
                   user: User,
                   filters: list[int],
                   skip: int,
                   limit: int) -> list[PostOutHome]:
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
                    WHEN :follower_id IS NOT NULL AND EXISTS (
                        SELECT 1 
                        FROM `like` l
                        WHERE l.post_id = p.id AND l.user_id = :follower_id
                    ) THEN TRUE 
                    ELSE FALSE 
                END AS like_set,
                b.id AS book_id,
                b.title AS book_title,
                b.author AS book_author,
                b.description AS book_description,
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
                    :filters = ""
                    OR p.id IN (
                        SELECT DISTINCT post_id 
                        FROM postfilter 
                        WHERE filter_id IN (:filters)
                    )
                
            ORDER BY 
                p.created_at DESC
            LIMIT :limit OFFSET :skip;
        """)
    
    # Execute posts query
    user_id = user.id if user else None
    posts_result = session.exec(
        posts_query, 
        params={"follower_id": user_id, "filters": filters, "skip": skip, "limit": limit}
    ).fetchall()

    return posts_result


def get_explorer_posts(*, 
                       session: Session,
                       user: User,
                       filters: str,
                       skip: int,
                       limit: int) -> list[PostOutHome]:

    posts = get_explorer_posts_db(session=session, user=user, filters=filters, skip=skip, limit=limit)
    
    # Process posts to build PostOutHome objects
    # Comprehension list to build this dictionary faster

    # Retrieve list of users that 'user' is following
    if user:
        following_users = session.exec(select(Followers.followee_id).where(Followers.follower_id == user.id)).all()
    else: following_users = set()

    posts = {row.post_id : PostOutHome(
            user=UserOutHome(id=row.user_id, username=row.username, following=row.user_id in following_users),
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
                description=row.book_description,
                created_at=row.book_created_at,
            ),
            n_comments=row.num_comments if row.num_comments else 0,
            comments=[],
            filters=[int(fid) for fid in row.filters.split(",") if row.filters],
        ) for row in posts}
    return list(posts.values()) # Return a list of PostOutHome objects




def get_account_posts(*, 
                   session: Session,
                   user_id: int,
                   user_id_acc: int
                ) -> list[PostOutHome]:

        p = PostRepository(session)
        return p.get_user_posts_with_comments(user_id, user_id_acc)