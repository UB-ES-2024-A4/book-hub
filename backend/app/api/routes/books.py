import os
from fastapi import (APIRouter, File, HTTPException, Depends, UploadFile, Path)
from fastapi.responses import FileResponse
from sqlmodel import Session

from app.core.database import get_session
from app.models import (
    Book,
    BookCreate, 
    BookUpdate
)
from app import crud, utils
from app.api.deps import (get_current_user)

router = APIRouter()

# Create book endpoint
@router.post("/",
             dependencies=[Depends(get_current_user)])
def create_book(new_book: BookCreate, session: Session = Depends(get_session)):

    utils.check_book_fields(title=new_book.title, author=new_book.author, description=new_book.description)

    post = crud.book.create_book(session=session, book_create=new_book)
    
    return {"message": "Book created successfully", "data": post}

# Get all books endpoint
@router.get("/all")
def get_all_books(session: Session = Depends(get_session)):
    books = crud.book.get_all_books(session=session)
    return books

# Get book by id endpoint
@router.get("/{book_id}")
def get_book_by_id(book_id: int, session: Session = Depends(get_session)):
    book = crud.book.get_book_by_id(session=session, book_id=book_id)
    if book:
        return book
    raise HTTPException(
        status_code=404,
        detail="Book not found",
    )

# Get all books with the same title
@router.get("/title/{title}")
def get_books_by_title(title: str = Path(..., min_length=1), session: Session = Depends(get_session)):
    books = crud.book.get_books_by_title(session=session, title=title)
    if books:
        return books
    raise HTTPException(
        status_code=404,
        detail="No books were found",
    )

# Get all books with the same author
@router.get("/author/{author}")
def get_books_by_author(author: str = Path(..., min_length=1), session: Session = Depends(get_session)):
    books = crud.book.get_books_by_author(session=session, author=author)
    if books:
        return books
    raise HTTPException(
        status_code=404,
        detail="No books were found",
    )

# Update book endpoint
@router.put("/{book_id}",
             dependencies=[Depends(get_current_user)])
def update_post(book_id: int, book_in: BookUpdate, session: Session = Depends(get_session)):
    # Get current book
    session_book : Book = crud.book.get_book_by_id(session=session, book_id=book_id)

    if not session_book: 
        raise HTTPException(
        status_code=404,
        detail="Book not found.",
    )

    post = crud.book.update_book(session=session, book_update=book_in, db_book=session_book)  
    
    return {"message": "Book updated successfully", "data": post}

# Delete book endpoint
@router.delete("/{book_id}",
             dependencies=[Depends(get_current_user)])
def delete_book(book_id: int, session: Session = Depends(get_session)):
    # Get current book
    session_book : Book = crud.book.get_book_by_id(session=session, book_id=book_id)

    if not session_book: 
        raise HTTPException(
        status_code=404,
        detail="Book not found.",
    )

    book = crud.book.delete_book(session=session, db_book=session_book)
    
    return {"message": "Book deleted successfully", "data": book}
