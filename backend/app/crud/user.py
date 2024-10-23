""" User related CRUD methods """
from typing import Any
from sqlmodel import Session, select
from app.models import User, UserCreate, UserUpdate


def create_user(*, session: Session, user_create: UserCreate) -> User:
    user = User.model_validate(
        user_create
    )

    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def update_user(*, session: Session, user_id: int, user: UserUpdate) -> Any:
    db_user : User= session.get(User, user_id)
    if db_user:
        db_user.username = user.username if user.username is not None else db_user.username
        db_user.first_name = user.first_name if user.first_name is not None else db_user.first_name
        db_user.last_name = user.last_name if user.last_name is not None else db_user.last_name
        session.commit()
        session.refresh(db_user)
        return db_user
    return None

def delete_user(*, session: Session, user_id: int) -> Any:
    user = session.get(User, user_id)
    if user:
        session.delete(user)
        session.commit()
        return user
    return None

def get_user(*, session: Session, user_id: int) -> Any:
    user = session.get(User, user_id)
    return user

def get_user_by_name(*, session: Session, name: str) -> Any:
    user = session.exec(select(User).where(User.username == name)).first()
    return user

def get_all_users(*, session: Session) -> Any:
    users = session.exec(select(User)).all()
    return users

