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