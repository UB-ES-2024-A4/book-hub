from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select
from datetime import datetime

from app import crud
from app.models import Post, User, Book, Comment, CommentCreate

comment = 'test_comment'
created_at = datetime.now()

def get_test_parameters(db: Session):
    user_test = db.exec(
        select(User).where(User.username == 'TEST_NAME')
    ).first()

    book_test = db.exec(
        select(Book).where(Book.title == 'TEST')
    ).first()

    post_test = db.exec(
        select(Post).where(Post.book_id == book_test.id and Post.user_id == user_test.id)
    ).first()

    return user_test.id, post_test.id

def test_create_comment(db: Session) -> None:
    user_id, post_id = get_test_parameters(db)

    comment_in = CommentCreate(post_id=post_id, comment=comment, created_at=created_at)
    created_comment = crud.comment.create_comment(session=db, comment_create=comment_in, usr_id=user_id)

    assert created_comment.user_id == user_id
    assert created_comment.post_id == post_id
    assert created_comment.comment == comment

def test_get_comments_by_post(db: Session) -> None:
    user_id, post_id = get_test_parameters(db)

    comment_in = CommentCreate(post_id=post_id, comment=comment, created_at=created_at)
    created_comment = crud.comment.create_comment(session=db, comment_create=comment_in, usr_id=user_id)

    comments = crud.comment.get_all_comments_by_post(session=db, post_id=post_id)

    for item in comments:
        assert item.post_id == post_id
        assert item.user_id
        assert item.comment
        assert item.created_at

def test_delete_comment(db: Session) -> None:
    user_id, post_id = get_test_parameters(db)

    comment_in = CommentCreate(post_id=post_id, comment=comment, created_at=created_at)
    created_comment = crud.comment.create_comment(session=db, comment_create=comment_in, usr_id=user_id)

    db_comment: Comment = db.get(Comment, created_comment.id)

    deleted_comment = crud.comment.delete_comment(session=db, db_comment=db_comment)
    assert deleted_comment