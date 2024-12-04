from app.models.post import Post
from app.models.user import User
from sqlmodel import Session, select
from datetime import datetime

from app.crud import comment as crud_comment
from app.models import CommentCreate, Comment

Comment()

comment = "Comment_Test"


def get_test_parameters(db: Session):
    user_test = db.exec(
        select(User).where(User.username == 'TEST_NAME')
    ).first()

    post_test = db.exec(select(Post)).first()

    return user_test, post_test.id

def test_create_comment_datetime(db: Session) -> None:
    user, post_id = get_test_parameters(db)

    comment_in = CommentCreate(post_id=post_id, comment=comment, created_at=datetime.now())
    created_comment = crud_comment.create_comment(session=db, comment=comment_in, user=user)

    assert created_comment.post_id == post_id
    assert created_comment.user == user
    assert created_comment.comment == comment

def test_create_comment_no_datetime(db: Session) -> None:
    user, post_id = get_test_parameters(db)

    comment_in = CommentCreate(post_id=post_id, comment=comment)
    created_comment = crud_comment.create_comment(session=db, comment=comment_in, user=user)

    assert created_comment.post_id == post_id
    assert created_comment.user == user
    assert created_comment.comment == comment

def test_create_empty_comment(db: Session) -> None:
    user, post_id = get_test_parameters(db)

    comment_in = CommentCreate(post_id=post_id, comment="")
    try:
        created_comment = crud_comment.create_comment(session=db, comment=comment_in, user=user)
    except ValueError as e:
        assert e.args[0] == 400
        assert e.args[1] == "Comment cannot be empty."

def test_create_wrong_post_comment(db: Session) -> None:
    user, post_id = get_test_parameters(db)

    comment_in = CommentCreate(post_id=-1, user=user, comment=comment)
    try:
        created_comment = crud_comment.create_comment(session=db, comment=comment_in, user=user)
    except ValueError as e:
        assert e.args[0] == 404
        assert e.args[1] == "Post not found."

def test_get_wrong_post_comments(db: Session) -> None:
    user, post_id = get_test_parameters(db)

    try:
        comments = crud_comment.get_post_comments(session=db, post_id=-1)
    except ValueError as e:
        assert e.args[0] == 404
        assert e.args[1] == "Post not found."
