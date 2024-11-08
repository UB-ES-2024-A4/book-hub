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

def get_book_by_id(*, session: Session, book_id: int) -> Any:
    book = session.get(Book, book_id)
    return book

def get_books_by_title(*, session: Session, title: str) -> Any:
    books = session.exec(select(Book).where(Book.title.contains(title))).all()
    return books

def get_books_by_author(*, session: Session, author: str) -> Any:
    books = session.exec(select(Book).where(Book.author.contains(author))).all()
    return books

def get_all_books(*, session: Session) -> Any:
    books = session.exec(select(Book)).all()
    return books