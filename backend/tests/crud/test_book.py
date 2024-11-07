from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select
from datetime import datetime

from app import crud
from app.models import Post, Book, BookCreate, BookUpdate

title = 'Book_Test'
author = 'Tester'
description = 'Fcking great'
created_at = datetime.now()

def test_create_book(db: Session) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    created_book = crud.book.create_book(session=db, book_create=book_in)

    assert created_book.title == title
    assert created_book.author == author
    assert created_book.description == description