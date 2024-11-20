""" Post related CRUD methods """
from typing import Any
from sqlmodel import Session, select, delete
from app.models import Post, PostCreate, PostUpdate, PostFilter

def create_post(*, session: Session, post_create: PostCreate) -> Post:
    post = Post.model_validate(post_create)

    session.add(post)
    session.commit()
    session.refresh(post)

    for filter_id in post_create.filter_ids:
        post_filter = PostFilter(post_id=post.id, filter_id=filter_id)
        session.add(post_filter)

    session.commit()

    session.refresh(post)
    return post

def update_post(*, session: Session, post_update: PostUpdate, db_post: Post) -> Post:
    post_data = post_update.model_dump(exclude_unset=True)

    db_post.sqlmodel_update(post_data)
    session.add(db_post)
    session.commit()

    if post_update.filter_ids is not None:
        # Clear existing filters
        session.exec(delete(PostFilter).where(PostFilter.post_id == db_post.id))

        for filter_id in post_update.filter_ids:
            post_filter = PostFilter(post_id=db_post.id, filter_id=filter_id)
            session.add(post_filter)

        session.commit()

    session.refresh(db_post)
    return db_post

def delete_post(*, session: Session, db_post: Post) -> Post:
    session.delete(db_post)
    session.commit()
    return db_post

def get_post(*, session: Session, post_id: int) -> Any:
    post = session.get(Post, post_id)
    return post

def get_all_posts(*, session: Session) -> Any:
    posts = session.exec(select(Post)).all()
    return posts

def get_posts_by_book_id(*, session: Session, book_id: int) -> Any:
    posts = session.exec(select(Post).where(Post.book_id == book_id)).all()
    return posts

def get_posts_by_user_id(*, session: Session, user_id: int) -> Any:
    posts = session.exec(select(Post).where(Post.user_id == user_id)).all()
    return posts