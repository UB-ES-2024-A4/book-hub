from fastapi import HTTPException
from app.models.user import User
from sqlmodel import select

def check_email_name_length(username: str, first_name: str, last_name: str):
    max_length = 20
    min_length = 3

    if len(username) < min_length:
        raise HTTPException(
            status_code=400,
            detail="Username must contain at least 3 characters.",
        )
    
    if (len(username) > max_length or len(first_name) > max_length or len(last_name) > max_length):
        raise HTTPException(
            status_code=400,
            detail="Username, first name and last name must contain at most 20 characters.",
        )
    
def check_existence_email(email: str, session):
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()

    if session_user:
        raise HTTPException(
            status_code=400,
            detail="This email is already in use.",
        )
    
def check_existence_usrname(username: str, session):    
    statement = select(User).where(User.username == username)
    session_user = session.exec(statement).first()

    if session_user:
        raise HTTPException(
            status_code=400,
            detail="This username is already in use.",
        )
    
def check_pwd_length(password: str):
    if not (8 <= len(password) <= 28):
        raise HTTPException(
            status_code=400,
            detail="Password must contain between 8 and 28 characters.",
        )
    