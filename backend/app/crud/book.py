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

def update_book(*, session: Session, book_update: BookUpdate, db_book: Book) -> Book:
    book_data = book_update.model_dump(exclude_unset=True)
    db_book.sqlmodel_update(book_data)
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book