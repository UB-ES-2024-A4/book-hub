from typing import Any, Annotated
from app.core.security import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import (APIRouter, HTTPException, Depends)
from sqlmodel import Session
from datetime import timedelta

from app.core.database import get_session
from app.core.config import settings
from app.models.user import (
    Token,
    User,
    UserCreate,
    UserUpdate,
    UserOut,
    UserLogin
)
from app.api.deps import get_current_user
from app import crud, utils

# Imports para profile pictures
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
from pathlib import Path
import os

# Directorio para guardar las imágenes
UPLOAD_DIR = Path("profile_pictures")
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter()

# Endpoint para obtener el primer usuario
# Este es un endpoint dummy, para probar que la API funciona.
@router.get("/", response_model=UserOut)
def get_first_user(session: Session = Depends(get_session)):
    result : User = crud.user.get_user(session=session, user_id=1)
    if result:
        return {"user_id": result.id}
    return {"error": "No users found"}

@router.get("/me")
def read_user_me(current_user: User = Depends(get_current_user)) -> Any:
    # Get current user.
    return current_user

# Endpoint para obtener todos los usuarios
@router.get("/all")
def get_all_users(session: Session = Depends(get_session)):
    users = crud.user.get_all_users(session=session)
    return users

# Endpoint para crear un usuario
@router.post("/")
def create_user(new_user: UserCreate, session: Session = Depends(get_session)):
    utils.check_existence_email(new_user.email, session)
    
    utils.check_existence_usrname(new_user.username, session)

    utils.check_missing_fields(new_user.first_name, new_user.last_name)

    utils.check_username_length(new_user.username, new_user.first_name, new_user.last_name)
    
    utils.check_pwd_length(new_user.password)
    
    return crud.user.create_user(session=session, user_create=new_user)

# Endpoint para actualizar un usuario
@router.put("/{user_id}")
def update_user(user_id: int, user: UserUpdate, session: Session = Depends(get_session)):
    # Get current user
    session_user : User = crud.user.get_user(session=session, user_id=user_id)

    if not session_user: 
        raise HTTPException(
        status_code=404,
        detail="User not found.",
    )

    # Check if the username is to be updated
    if session_user.username != user.username:
        utils.check_existence_usrname(user.username, session)
    
    utils.check_username_length(user.username, user.first_name, user.last_name)
        
    user = crud.user.update_user(session=session, user_id=user_id, user=user)
    if user:
        return user
    


# Endpoint para eliminar un usuario
@router.delete("/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = crud.user.delete_user(session=session, user_id=user_id)
    if user:
        return {"message": "User deleted successfully"}
    raise HTTPException(
        status_code=404,
        detail="User not found.",
    )

# Endpoint para obtener un usuario por su ID
@router.get("/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = crud.user.get_user(session=session, user_id=user_id)
    if user:
        return user
    raise HTTPException(
        status_code=404,
        detail="User not found.",
    )

# Endpoint para obtener un usuario por su nombre
@router.get("/name/{name}")
def get_user_by_name(name: str, session: Session = Depends(get_session)):
    user = crud.user.get_user_by_name(session=session, name=name)
    if user:
        return user
    raise HTTPException(
        status_code=404,
        detail="User not found.",
    )


# Login
@router.post("/login/access-token")
def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: Session = Depends(get_session)) -> Token:
    
    # TODO: Password encryption

    user = crud.user.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(status_code=400, detail="Either a user with this email or username does not exist or the password is incorrect.")
    
    access_token_expires = timedelta(minutes=settings.TOKEN_EXPIRE_TIME)
    
    return Token(
        access_token=create_access_token(
            user.id,
            expires_delta=access_token_expires
            )
        )

# These are the endpoints of profile picture, that now are stored in the backend api server.
# When we perform deployment these methods will be erased and the requests go directly to the storage server (Azure)

@router.put("/pfp/{user_id}")
async def update_profile_picture(user_id: int, file: UploadFile = File(...)):
    # Validar formato de archivo
    if not file.filename.endswith(("jpg", "jpeg", "png")):
        raise HTTPException(status_code=400, detail="Invalid file format. Only jpg, jpeg, and png are allowed.")

    # Definir la ruta del archivo a guardar
    file_path = UPLOAD_DIR / f"{user_id}.{file.filename.split('.')[-1]}"

    if file_path.exists():
        os.remove(file_path)
    else:
        #Verificar todas las demás extensiones
        for ext in ["jpg", "jpeg", "png"]:
            file_path = UPLOAD_DIR / f"{user_id}.{ext}"
            if file_path.exists():
                os.remove(file_path)

    # Guardar la imagen en el directorio
    with file_path.open("wb") as buffer:
        buffer.write(await file.read())

    return {"message": "Profile picture updated successfully", "file_path": str(file_path)}

@router.get("/pfp/{user_id}")
async def get_profile_picture(user_id: int):
    # Buscar la imagen del perfil del usuario
    for ext in ["jpg", "jpeg", "png"]:
        file_path = UPLOAD_DIR / f"{user_id}.{ext}"
        if file_path.exists():
            return FileResponse(path=str(file_path))

    raise HTTPException(status_code=404, detail="Profile picture not found")

@router.delete("/pfp/{user_id}")
async def delete_profile_picture(user_id: int):
    # Buscar y eliminar la imagen del perfil del usuario
    for ext in ["jpg", "jpeg", "png"]:
        file_path = UPLOAD_DIR / f"{user_id}.{ext}"
        if file_path.exists():
            os.remove(file_path)
            return {"message": "Profile picture deleted successfully"}

    raise HTTPException(status_code=404, detail="Profile picture not found")