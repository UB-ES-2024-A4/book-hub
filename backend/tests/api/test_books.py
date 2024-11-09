from fastapi.testclient import TestClient

from app.models import User, Book, BookCreate
from sqlmodel import Session, select, text
from datetime import datetime
from app.core.config import settings
from app import crud

title = 'Book_Test'
author = 'Tester'
description = 'Bad'
created_at = datetime.now()

def test_create_book_missing_fields(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    data = {'author': author, 'title': title+'a', 'description': ''}

    r = client.post(
        "/books/",
        headers=logged_user_token_headers,
        json=data
    )

    created_book = r.json()

    assert r.status_code == 400
    assert created_book['detail'] == "Created book is missing parameters"
    
    data = {'author': author, 'title': '', 'description': description}

    r = client.post(
        "/books/",
        headers=logged_user_token_headers,
        json=data
    )

    created_book = r.json()

    assert r.status_code == 400
    assert created_book['detail'] == "Created book is missing parameters"
    
    data = {'author': '', 'title': title, 'description': description}

    r = client.post(
        "/books/",
        headers=logged_user_token_headers,
        json=data
    )

    created_book = r.json()

    assert r.status_code == 400
    assert created_book['detail'] == "Created book is missing parameters"

def test_create_book_not_logged_usr(
    client: TestClient, db: Session
) -> None:
    data = {'author': author, 'title': title, 'description': description}

    r = client.post(
        "/books/",
        headers={},
        json=data
    )

    created_book = r.json()

    assert r.status_code == 401
    assert created_book["detail"] == "Not authenticated"

def test_create_book(
    client: TestClient, db: Session, logged_user_token_headers: dict[str, str]
) -> None:
    data = {'author': author, 'title': title, 'description': description}

    r = client.post(
        "/books/",
        headers=logged_user_token_headers,
        json=data
    )

    created_book = r.json()

    assert r.status_code == 200
    assert created_book['message'] == "Book created successfully"
    assert created_book['data']['author'] == author
    assert created_book['data']['title'] == title
    assert created_book['data']['description'] == description

def test_get_all_books(
    client: TestClient, db: Session
) -> None:
    book_in = BookCreate(author=author, title=title, description=description)
    crud.book.create_book(session=db, book_create=book_in)

    book_in2 = BookCreate(author=author, title=title, description=description)
    crud.book.create_book(session=db, book_create=book_in2)

    r = client.get(
        "/books/all"
    )

    all_books = r.json()

    assert len(all_books) > 1
    for item in all_books:
        assert 'title' in item
        assert 'author' in item
        assert 'description' in item

def test_get_books_empty(
    client: TestClient, db: Session
) -> None:
    try:
        db.execute(text('DELETE FROM book'))

        r = client.get(
            "/books/all"
        )

        all_books = r.json()

        assert r.status_code == 200
        assert all_books == []
    finally:
        db.rollback()

def test_get_book_by_id(
    client: TestClient, db: Session
) -> None:
    book_in = BookCreate(author=author, title=title, description=description)
    book = crud.book.create_book(session=db, book_create=book_in)

    r = client.get(
        f'/books/{book.id}'
    )

    assert r.status_code == 200
    retrieved_book = r.json()
    assert retrieved_book
    assert book.author == retrieved_book["author"]
    assert book.title == retrieved_book["title"]
    assert book.description == retrieved_book["description"]

def test_get_book_not_found_by_id(
    client: TestClient, db: Session
) -> None:
    r = client.get(
        f"/books/-1",
    )
    
    assert r.status_code == 404
    assert r.json()["detail"] == "Book not found"

def test_get_book_by_title_not_found(
    client: TestClient, db: Session
) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in)
    
    book_in2 = BookCreate(title='BookTest2', author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in2)

    r = client.get(
        f'/books/title/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    )

    assert r.status_code == 404
    assert r.json()["detail"] == "No books were found"

def test_get_book_by_title(
    client: TestClient, db: Session
) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in)
    
    book_in2 = BookCreate(title='BookTest2', author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in2)

    r = client.get(
        f'/books/title/ook'
    )

    all_books = r.json()

    assert r.status_code == 200
    for item in all_books:
        assert 'ook' in item['title'].lower()

def test_get_book_by_author_not_found(
    client: TestClient, db: Session
) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in)
    
    book_in2 = BookCreate(title=title, author='Second_Tester', description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in2)

    r = client.get(
        f'/books/author/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    )

    assert r.status_code == 404
    assert r.json()["detail"] == "No books were found"

def test_get_book_by_author(
    client: TestClient, db: Session
) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in)
    
    book_in2 = BookCreate(title=title, author='Second_Tester', description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in2)

    r = client.get(
        f'/books/author/tes'
    )

    all_books = r.json()

    assert r.status_code == 200
    for item in all_books:
        assert 'tes' in item['author'].lower()