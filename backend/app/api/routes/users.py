from fastapi import APIRouter
from fastapi import Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.security import create_access_token
from app.models.user import (
    User,
    UserCreate,
    UserUpdate,
    UserLogin,
    Token
)
from app import crud
from app import utils

router = APIRouter()

# Endpoint para obtener el primer usuario
# Este es un endpoint dummy, para probar que la API funciona.
@router.get("/")
def get_first_user(session: Session = Depends(get_session)):
    result = crud.user.get_user(session=session, user_id=1)
    if result:
        return {"username": result.username}
    return {"error": "No users found"}

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

    utils.check_email_name_length(new_user.username, new_user.first_name, new_user.last_name)
    
    utils.check_pwd_length(new_user.password)
    
    return crud.user.create_user(session=session, user_create=new_user)

# Endpoint para actualizar un usuario
@router.put("/{user_id}")
def update_user(user_id: int, user: UserUpdate, session: Session = Depends(get_session)):
    # Get current user
    session_user = crud.user.get_user(session=session, user_id=user_id)

    # Check if the username is to be updated
    if session_user.username != user.username:
        utils.check_existence_usrname(user.username, session)
    
    utils.check_email_name_length(user.username, user.first_name, user.last_name)
        
    user = crud.user.update_user(session=session, user_id=user_id, user=user)
    if user:
        return user
    return {"error": "User not found"}


# Endpoint para eliminar un usuario
@router.delete("/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = crud.user.delete_user(session=session, user_id=user_id)
    if user:
        return {"message": "User deleted successfully"}
    return {"error": "User not found"}

# Endpoint para obtener un usuario por su ID
@router.get("/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = crud.user.get_user(session=session, user_id=user_id)
    if user:
        return user
    return {"error": "User not found"}

# Endpoint para obtener un usuario por su nombre
@router.get("/name/{name}")
def get_user_by_name(name: str, session: Session = Depends(get_session)):
    user = crud.user.get_user_by_name(session=session, name=name)
    if user:
        return user
    return {"error": "User not found"}


# Login
@router.post("/login")
def login_user(userLogin : UserLogin, session: Session = Depends(get_session)):
    
    # TODO: Password encryption
    
    user : User = None

    if userLogin.username:
        user = session.exec(select(User).where(User.username == userLogin.username)).first()
    elif userLogin.email:
        user = session.exec(select(User).where(User.email == userLogin.email)).first()
    else:
        raise HTTPException(status_code=400, detail="Username or email has to be provided.")
    
    if not user:
        raise HTTPException(status_code=400, detail="User with this email or username do not exists.")

    if user.password == userLogin.password:
        return Token(acces_token=create_access_token(user.id))
    else: 
        raise HTTPException(status_code=400, detail="Password incorrect.")