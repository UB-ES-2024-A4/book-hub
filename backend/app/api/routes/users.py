from fastapi import APIRouter
from fastapi import Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy import or_
from app.core.database import get_session
from app.models.user import User

router = APIRouter()

# Endpoint para obtener el primer usuario
# Este es un endpoint dummy, para probar que la API funciona.
@router.get("/")
def get_first_user(session: Session = Depends(get_session)):
    result = session.exec(select(User)).first()
    if result:
        return {"username": result.username}
    return {"error": "No users found"}

# Endpoint para obtener todos los usuarios
@router.get("/all")
def get_all_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

# Endpoint para crear un usuario
@router.post("/")
def create_user(user: User, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user.email)
    session_user = session.exec(statement).first()

    if session_user:
        raise HTTPException(
            status_code=400,
            detail="This email is already in use.",
        )
    
    statement = select(User).where(User.username == user.username)
    session_user = session.exec(statement).first()

    if session_user:
        raise HTTPException(
            status_code=400,
            detail="This username is already in use.",
        )
    
    if len(user.username) < 3:
        raise HTTPException(
            status_code=400,
            detail="Username must contain at least 3 characters.",
        )
    
    max_length = 20
    if (len(user.username) > max_length or len(user.first_name) > max_length or len(user.laset_name) > max_length):
        raise HTTPException(
            status_code=400,
            detail="Username, first name and last name must contain at most 20 characters.",
        )
    
    if not (8 <= len(user.password) <= 28):
        raise HTTPException(
            status_code=400,
            detail="Password must contain between 8 and 28 characters.",
        )

    
    if user.id == 0: user.id = None
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

# Endpoint para actualizar un usuario
@router.put("/{user_id}")
def update_user(user_id: int, user: User, session: Session = Depends(get_session)):
    db_user : User = session.get(User, user_id)
    statement = select(User).where(User.username == user.username)
    session_user = session.exec(statement).first()

    if session_user:
        raise HTTPException(
            status_code=400,
            detail="This username is already in use.",
        )
    
    if len(user.username) < 3:
        raise HTTPException(
            status_code=400,
            detail="Username must contain at least 3 characters.",
        )
    
    if (len(user.username) > 20 or len(user.first_name) > 20 or len(user.laset_name) > 20):
        raise HTTPException(
            status_code=400,
            detail="Username, first name and last name must contain at most 20 characters.",
        )
    
    if db_user:
        db_user.id = user.id
        db_user.username = user.username
        session.commit()
        session.refresh(db_user)
        return db_user
    return {"error": "User not found"}


# Endpoint para eliminar un usuario
@router.delete("/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if user:
        session.delete(user)
        session.commit()
        return {"message": "User deleted successfully"}
    return {"error": "User not found"}

# Endpoint para obtener un usuario por su ID
@router.get("/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if user:
        return user
    return {"error": "User not found"}

# Endpoint para obtener un usuario por su nombre
@router.get("/name/{name}")
def get_user_by_name(name: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == name)).first()
    if user:
        return user
    return {"error": "User not found"}
