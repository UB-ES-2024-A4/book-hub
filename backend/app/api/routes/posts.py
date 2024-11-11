import os
from fastapi import (APIRouter, File, HTTPException, Depends, UploadFile)
from fastapi.responses import FileResponse
from sqlmodel import Session

from app.core.database import get_session
from app.models import (
    Post, 
    PostCreate,
    PostUpdate,
    User
)
from app import crud, utils
from app.api.deps import (get_current_user)

# Imports para post pictures
from pathlib import Path

# Directorio para guardar las imágenes
UPLOAD_DIR = Path("post_pictures")
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter()

# Create post endpoint
@router.post("/",
             dependencies=[Depends(get_current_user)])
def create_post(new_post: PostCreate, session: Session = Depends(get_session)):
    utils.check_existence_book_user(new_post.book_id, new_post.user_id, session)

    utils.check_quantity_likes(new_post.likes)

    post : Post = crud.post.create_post(session=session, post_create=new_post)
    
    return {"message": "Post created successfully", "data": post}

# Get all posts endpoint
@router.get("/all")
def get_all_posts(session: Session = Depends(get_session)):
    posts = crud.post.get_all_posts(session=session)
    return posts

# Get post by id endpoint
@router.get("/{post_id}")
def get_post(post_id: int, session: Session = Depends(get_session)):
    post : Post = crud.post.get_post(session=session, post_id=post_id)
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
@router.put("/{post_id}",
             dependencies=[Depends(get_current_user)])
def update_post(post_id: int, post_in: PostUpdate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Get current post
    session_post : Post = crud.post.get_post(session=session, post_id=post_id)

    if not session_post: 
        raise HTTPException(
        status_code=404,
        detail="Post not found.",
    )

    utils.check_ownership(current_usr_id=current_user.id, check_usr_id=session_post.user_id)

    post = crud.post.update_post(session=session, post_update=post_in, db_post=session_post)  
    
    return {"message": "Post updated successfully", "data": post}

# Delete post endpoint
@router.delete("/{post_id}",
             dependencies=[Depends(get_current_user)])
def delete_user(post_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Get current post
    session_post : Post = crud.post.get_post(session=session, post_id=post_id)

    if not session_post: 
        raise HTTPException(
        status_code=404,
        detail="Post not found.",
    )

    utils.check_ownership(current_usr_id=current_user.id, check_usr_id=session_post.user_id)

    post = crud.post.delete_post(session=session, db_post=session_post)
    
    return {"message": "Post deleted successfully", "data": post}



# These are the endpoints of post picture, that now are stored in the backend api server.
# When we perform deployment these methods will be erased and the requests go directly to the storage server (Azure)

@router.put("/images/{post_id}")
async def update_post_picture(post_id: int, file: UploadFile = File(...)):
    # Validar formato de archivo
    if not file.filename.endswith(("jpg", "jpeg", "png")):
        raise HTTPException(status_code=400, detail="Invalid file format. Only jpg, jpeg, and png are allowed.")

    # Definir la ruta del archivo a guardar
    file_path = UPLOAD_DIR / f"{post_id}.{file.filename.split('.')[-1]}"

    if file_path.exists():
        os.remove(file_path)
    else:
        #Verificar todas las demás extensiones
        for ext in ["jpg", "jpeg", "png"]:
            file_path = UPLOAD_DIR / f"{post_id}.{ext}"
            if file_path.exists():
                os.remove(file_path)

    # Guardar la imagen en el directorio
    with file_path.open("wb") as buffer:
        buffer.write(await file.read())

    return {"message": "Post picture updated successfully", "file_path": str(file_path)}

@router.get("/images/{post_id}")
async def get_post_picture(post_id: int):

    for ext in ["jpg", "jpeg", "png"]:
        file_path = UPLOAD_DIR / f"{post_id}.{ext}"
        if file_path.exists():
            return FileResponse(path=str(file_path))

    raise HTTPException(status_code=404, detail="Post picture not found")

@router.delete("/images/{post_id}")
async def delete_post_picture(post_id: int):

    for ext in ["jpg", "jpeg", "png"]:
        file_path = UPLOAD_DIR / f"{post_id}.{ext}"
        if file_path.exists():
            os.remove(file_path)
            return {"message": "Post picture deleted successfully"}

    raise HTTPException(status_code=404, detail="Post picture not found")