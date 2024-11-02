from fastapi import (APIRouter, HTTPException, Depends)
from sqlmodel import Session

from app.core.database import get_session
from app.models.post import (
    Post, 
    PostCreate,
    PostUpdate
)
from app import crud, utils

# Imports para post pictures
from pathlib import Path

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

# Get all posts endpoint
@router.get("/all")
def get_all_posts(session: Session = Depends(get_session)):
    posts = crud.post.get_all_posts(session=session)
    return posts

# Get post by id endpoint
@router.get("/{post_id}")
def get_post(post_id: int, session: Session = Depends(get_session)):
    post = crud.post.get_post(session=session, post_id=post_id)
    if post:
        return post
    raise HTTPException(
        status_code=404,
        detail="Post not found.",
    )

# Get all posts with the same user_id endpoint
@router.get("/user/{user_id}")
def get_posts_by_user_id(user_id: int, session: Session = Depends(get_session)):
    utils.check_existence_book_user(book_id=None, user_id=user_id, session=session)
    posts = crud.post.get_posts_by_user_id(session=session, user_id=user_id)
    if posts:
        return posts
    raise HTTPException(
        status_code=404,
        detail="This user has no posts.",
    )

# Get all posts with the same book_id endpoint
@router.get("/book/{book_id}")
def get_posts_by_book_id(book_id: int, session: Session = Depends(get_session)):
    utils.check_existence_book_user(book_id=book_id, user_id=None, session=session)
    posts = crud.post.get_posts_by_book_id(session=session, book_id=book_id)
    if posts:
        return posts
    raise HTTPException(
        status_code=404,
        detail="This book has no posts.",
    )

# Update post endpoint
@router.put("/{post_id}")
def update_user(post_id: int, post_in: PostUpdate, session: Session = Depends(get_session)):
    # Get current post
    session_post : Post = crud.post.get_post(session=session, post_id=post_id)

    if not session_post: 
        raise HTTPException(
        status_code=404,
        detail="Post not found.",
    )

    post = crud.post.update_post(session=session, post_update=post_in, db_post=session_post)  
    
    return {"message": "Post updated successfully", "data": post}

# Delete post endpoint
@router.delete("/{post_id}")
def delete_user(post_id: int, session: Session = Depends(get_session)):
    # Get current post
    session_post : Post = crud.post.get_post(session=session, post_id=post_id)

    if not session_post: 
        raise HTTPException(
        status_code=404,
        detail="Post not found.",
    )

    post = crud.post.delete_post(session=session, db_post=session_post)
    
    return {"message": "Post deleted successfully", "data": post}