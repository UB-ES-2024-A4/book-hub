""" Book related CRUD methods """
from typing import Any
from sqlmodel import Session, select
from app.models import Book, BookCreate, BookUpdate

def create_book(*, session: Session, book_create: BookCreate) -> Book:
    book = Book.model_validate(book_create)

    session.add(book)
    session.commit()
    session.refresh(book)
    return book