from typing import Any, Annotated
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import (APIRouter, HTTPException, Depends)
from sqlmodel import Session
from datetime import timedelta

from app.core.database import get_session
from app.core.config import settings
from app.models.post import (
    Post, 
    PostCreate,
    PostUpdate
)
from app.api.deps import get_current_user
from app import crud, utils

# Imports para post pictures
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
from pathlib import Path
import os

# Directorio para guardar las imágenes
UPLOAD_DIR = Path("post_pictures")
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter()

# Create post endpoint
@router.post("/")
def create_post(new_post: PostCreate, session: Session = Depends(get_session)):
    utils.check_existence_book_user(new_post.book_id, new_post.user_id, session)

    utils.check_quantity_likes(new_post.likes)

    post = crud.post.create_post(session=session, post_create=new_post)
    
    return {"message": "Post created successfully", "data": post}
