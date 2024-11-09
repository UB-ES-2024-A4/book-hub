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
