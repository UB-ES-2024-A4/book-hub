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

def test_get_book_by_id(db: Session) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    created_book = crud.book.create_book(session=db, book_create=book_in)

    book = crud.book.get_book_by_id(session=db, book_id=created_book.id)

    assert book.title == title
    assert book.author == author
    assert book.description == description

def test_get_books_by_title(db: Session) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in)
    
    book_in2 = BookCreate(title='BookTest2', author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in2)

    all_books = crud.book.get_books_by_title(session=db, title='ook')

    assert len(all_books) > 1
    for item in all_books:
        assert 'ook' in item.title.lower()
        assert item.author
        assert item.description

def test_get_books_by_author(db: Session) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in)
    
    book_in2 = BookCreate(title=title, author='Second_Tester', description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in2)

    all_books = crud.book.get_books_by_author(session=db, author='tes')

    print('AAAAAAAAAAAAA')
    print(all_books)

    assert len(all_books) > 1
    for item in all_books:
        assert item.title
        assert 'tes' in item.author.lower()
        assert item.description

def test_get_all_books(db: Session) -> None:
    book_in = BookCreate(title=title, author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in)
    
    book_in2 = BookCreate(title=title, author=author, description=description, created_at=created_at)
    crud.book.create_book(session=db, book_create=book_in2)

    all_books = crud.book.get_all_books(session=db)

    assert len(all_books) > 1
    for item in all_books:
        assert item.title
        assert item.author
        assert item.description