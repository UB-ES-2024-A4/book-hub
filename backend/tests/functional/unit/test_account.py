import pytest
from sqlmodel import Session, select
from datetime import datetime
from app.models import User, Post, Book, Comment, Like, Followers
from app.models.account_info import PostRepository

@pytest.fixture
def test_user(db: Session) -> User:
    """Fixture para crear un usuario de prueba."""
    user = User(username="TEST_USERNAME", email="TEST_EMAIL_FORUSERNAME@test.com", password="TEST_PASSWORD")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def test_user_acc(db: Session) -> User:
    """Fixture para crear otro usuario (user_id_acc)."""
    user = User(username="TEST_USER_ACC", email="TEST_EMAIL_ACC@test.com", password="TEST_PASSWORD")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def test_book(db: Session) -> Book:
    """Fixture para crear un libro de prueba."""
    book = Book(
        title="TEST_BOOK",
        author="TEST_AUTHOR",
        description="TEST_DESCRIPTION",
        created_at=datetime.now(),
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@pytest.fixture
def test_post(db: Session, test_user_acc: User, test_book: Book) -> Post:
    """Fixture para crear un post de prueba."""
    post = Post(
        user_id=test_user_acc.id,
        book_id=test_book.id,
        description="TEST_POST_DESCRIPTION",
        likes=10,
        created_at=datetime.now(),
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@pytest.fixture
def test_comment(db: Session, test_post: Post, test_user: User) -> Comment:
    """Fixture para crear un comentario en el post de prueba."""
    comment = Comment(
        post_id=test_post.id,
        user_id=test_user.id,
        comment="TEST_COMMENT",
        created_at=datetime.now(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@pytest.fixture
def test_like(db: Session, test_post: Post, test_user: User) -> Like:
    """Fixture para crear un like en el post de prueba."""
    like = Like(post_id=test_post.id, user_id=test_user.id)
    db.add(like)
    db.commit()
    db.refresh(like)
    return like


@pytest.fixture
def test_follower(db: Session, test_user: User, test_user_acc: User) -> Followers:
    """Fixture para crear una relación de seguimiento entre usuarios."""
    follower = Followers(follower_id=test_user.id, followee_id=test_user_acc.id)
    db.add(follower)
    db.commit()
    db.refresh(follower)
    return follower


def test_get_user_posts_with_comments(
    db: Session,
    test_user: User,
    test_user_acc: User,
    test_post: Post,
    test_comment: Comment,
    test_like: Like,
    test_follower: Followers,
) -> None:
    """Test para obtener posts de un usuario con comentarios y likes."""
    repository = PostRepository(session=db)

    posts = repository.get_user_posts_with_comments(
        user_id=test_user.id, user_id_acc=test_user_acc.id
    )

    # Validar la estructura de los posts devueltos
    assert len(posts) == 1
    post = posts[0]

    assert post.user.id == test_user_acc.id
    assert post.user.username == test_user_acc.username

    # Validar detalles del post
    assert post.post.id == test_post.id
    assert post.post.likes == test_post.likes
    assert post.post.description == test_post.description

    # Validar información del libro
    assert post.book.id == test_post.book_id
    assert post.book.title == "TEST_BOOK"

    # Validar likes y seguimiento
    assert post.like_set is True
    assert post.user.following is True

    # Validar comentarios
    assert len(post.comments) == 1
    comment = post.comments[0]
    assert comment.id == test_comment.id
    assert comment.comment == test_comment.comment
    assert comment.user.id == test_user.id
    assert comment.user.username == test_user.username
