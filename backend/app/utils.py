from fastapi import HTTPException
from app.models import User, Book
from sqlmodel import select

def check_email_name_length(username: str, first_name: str, last_name: str):
    max_length = 20
    min_length = 3

    if len(username) < min_length:
        raise HTTPException(
            status_code=400,
            detail="Username must contain at least 3 characters.",
        )
    
    if username.find(" ") != -1:
        raise HTTPException(
            status_code=400,
            detail="Username must not contain spaces."
        )

    if (len(username) > max_length or len(first_name) > max_length or len(last_name) > max_length):
        raise HTTPException(
            status_code=400,
            detail="Username, first name and last name must contain at most 20 characters.",
        )
    
def check_missing_fields(first_name: str, last_name: str):
    if (not first_name or not last_name):
        raise HTTPException(
            status_code=400,
            detail="First name and last name required.",
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
    
def check_existence_book_user(book_id: int | None, user_id: int | None, session):
    if user_id:
        statement = select(User).where(User.id == user_id)
        session_user = session.exec(statement).first()

        if not session_user: 
            raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if book_id:
        statement = select(Book).where(Book.id == book_id)
        session_book = session.exec(statement).first()

        if not session_book: 
            raise HTTPException(
            status_code=404,
            detail="Book not found.",
        )

def check_quantity_likes(likes: int):
    if likes != 0:
        raise HTTPException(
            status_code=400,
            detail="Created post must have 0 likes.",
        )
    
def check_ownership(current_usr_id: int, check_usr_id: int):
    if current_usr_id != check_usr_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to do this action",
        )
    
def check_book_fields(title: str, author: str, description: str):
    if title == None or author == None or description == None or not title or not author or not description: 
        raise HTTPException(
            status_code=400,
            detail="Created book is missing parameters",
        )