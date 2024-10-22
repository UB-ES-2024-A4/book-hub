from fastapi import APIRouter
from fastapi import Depends
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import User, UserCreate, UserUpdate
from app import crud

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
    return crud.user.create_user(session=session, user_create=new_user)

# Endpoint para actualizar un usuario
@router.put("/{user_id}")
def update_user(user_id: int, user: UserUpdate, session: Session = Depends(get_session)):
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
