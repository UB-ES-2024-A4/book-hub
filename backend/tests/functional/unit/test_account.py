import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from datetime import datetime
from app.main import app  # Importa tu aplicación FastAPI
from app.models import User, Post, Book, Comment, Like, Followers
from app.models.account_info import PostRepository


@pytest.fixture
def test_user(db: Session) -> User:
    """Fixture para crear un usuario de prueba."""
    user = db.exec(select(User).where(User.email == "TEST_EMAIL_FORUSERNAME@test.com")).first()

    if user:
        return user

    user = User(username="TEST_USERNAME", email="TEST_EMAIL_FORUSERNAME@test.com", password="TEST_PASSWORD")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def test_user_acc(db: Session) -> User:
    """Fixture para crear otro usuario (user_id_acc)."""
    user = db.exec(select(User).where(User.email == "TEST_EMAIL_ACC@test.com")).first()

    if user:
        return user
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
    
    post = db.exec(select(Post).where(Post.description == "TEST_POST_DESCRIPTION")).first()

    if post:
        return post

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
    
    comment = db.exec(select(Comment).where(Comment.comment == "COMMENT_1")).first()
    if comment:
        return comment

    comment = Comment(
        post_id=test_post.id,
        user_id=test_user.id,
        comment="COMMENT_1",
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


@pytest.fixture
def test_like(db: Session, test_post: Post, test_user: User) -> Like:
    """Fixture para crear un like en el post de prueba."""
    like = db.exec(select(Like).where(Like.post_id == test_post.id, Like.user_id == test_user.id)).first()

    if like:
        return like

    like = Like(post_id=test_post.id, user_id=test_user.id)
    db.add(like)
    db.commit()
    db.refresh(like)
    return like


def test_user_not_found(db: Session, client: TestClient) -> None:
    """Test para validar error 404 si el usuario no existe."""
    response = client.get("/account/9999")  # ID de usuario que no existe
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found."


def test_get_user_posts_no_user(
    db: Session, test_user_acc: User, test_post: Post
) -> None:
    """Test para obtener posts sin un usuario autenticado."""
    repository = PostRepository(session=db)

    load = test_user

    posts = repository.get_user_posts_with_comments(None, user_id_acc=test_user_acc.id)

    post = posts[0]

    assert post.like_set is False
    assert post.user.following is False
    assert post.post.id == test_post.id


def test_api_get_account(
    db: Session,
    test_user: User,
    test_user_acc: User,
    test_post: Post,
    test_comment: Comment,
    test_like: Like,
    test_follower: Followers,
    client: TestClient,
) -> None:
    """Test para validar el endpoint de obtener posts."""

    response = client.get(f"/account/{test_user_acc.id}")
    assert response.status_code == 200

    posts = response.json()

    post = posts[0]

    assert post["user"]["id"] == test_user_acc.id
    assert post["user"]["username"] == test_user_acc.username

    assert post["post"]["id"] == test_post.id
    assert post["post"]["likes"] == test_post.likes
    assert post["post"]["description"] == test_post.description

    assert post["book"]["id"] == test_post.book_id
    assert post["book"]["title"] == "TEST_BOOK"

    assert post["like_set"] is False
    assert len(post["comments"]) == 1
    comment = post["comments"][0]
    assert comment["id"] == test_comment.id
    assert comment["comment"] == test_comment.comment
    assert comment["user"]["id"] == test_user.id
    assert comment["user"]["username"] == test_user.username


def test_get_user_posts_empty(
    db: Session, test_user: User, test_user_acc: User
) -> None:
    """Test para un usuario que no tiene posts."""
    repository = PostRepository(session=db)

    posts = repository.get_user_posts_with_comments(user_id=test_user.id, user_id_acc=test_user_acc.id)

    assert len(posts) == 1


def test_api_get_account_empty_user(db: Session, test_user: User, client: TestClient) -> None:
    """Test para validar el endpoint con un usuario sin posts."""
    response = client.get(f"/account/{test_user.id}")
    assert response.status_code == 200
    assert response.json() == []


def test_get_user_posts_with_multiple_comments(
    db: Session, test_user: User, test_user_acc: User, test_post: Post, test_book: Book
) -> None:
    """Test para validar posts con múltiples comentarios."""
    # Crear múltiples comentarios
    comment_1 = Comment(
        post_id=test_post.id,
        user_id=test_user.id,
        comment="COMMENT_1",
        created_at=datetime.now(),
    )
    comment_2 = Comment(
        post_id=test_post.id,
        user_id=test_user.id,
        comment="COMMENT_2",
        created_at=datetime.now(),
    )
    db.add(comment_1)
    db.add(comment_2)
    db.commit()

    repository = PostRepository(session=db)

    posts = repository.get_liked_posts_by_user(user_id=test_user.id)

    post = posts[0]

    assert post.comments[0].comment == "COMMENT_1"


# TESTS PARA LA NUEVA FUNCIÓN
def test_get_liked_posts_with_comments(
    db: Session, test_user: User, test_user_acc: User, test_post: Post, test_like: Like, test_comment: Comment
) -> None:
    """Test para validar que solo se devuelven posts a los que el usuario ha dado like."""
    repository = PostRepository(session=db)

    posts = repository.get_liked_posts_by_user(user_id=test_user.id)

    post = posts[0]

    # Validar detalles del post
    assert post.post.id == test_post.id
    assert post.like_set is True
    assert post.user.id == test_user_acc.id
    assert post.user.username == test_user_acc.username

    # Validar detalles del libro
    assert post.book.title == "TEST_BOOK"

    # Validar comentarios
    comment = post.comments[0]
    assert comment.comment == "COMMENT_1"
    assert comment.user.id == test_user.id
    assert comment.user.username == test_user.username


def test_get_liked_posts_empty(db: Session, test_user: User) -> None:
    """Test para validar que devuelve una lista vacía si el usuario no ha dado like a ningún post."""
    repository = PostRepository(session=db)

    posts = repository.get_liked_posts_by_user(user_id=test_user.id)

    p = db.exec(select(Like).where(Like.user_id == test_user.id)).all()

    assert len(posts) == len(p)


def test_api_get_liked_posts(
    db: Session, test_user: User, test_post: Post, test_like: Like, test_comment: Comment, client: TestClient,logged_user_token_headers: dict[str, str]
) -> None:
    
    """Test para validar el endpoint de obtener posts que el usuario ha dado like."""
    response = client.get("/account/liked/", headers=logged_user_token_headers)
    assert response.status_code == 200

    posts = response.json()

    assert len(posts) == 0


def test_api_get_liked_posts_no_likes(db: Session, test_user: User, client: TestClient, logged_user_token_headers: dict[str, str]) -> None:
    """Test para validar que el endpoint devuelve una lista vacía si el usuario no ha dado like."""
    response = client.get("/account/liked/", headers=logged_user_token_headers)
    assert response.status_code == 200
    assert response.json() == []
