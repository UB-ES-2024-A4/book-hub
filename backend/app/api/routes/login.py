from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter
from fastapi import Depends, HTTPException
from sqlmodel import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_session
from app.core.config import settings
from app.core.security import create_access_token
from app.models.user import Token
from app import crud

router = APIRouter()

# Login
@router.post("/login/access-token")
def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: Session = Depends(get_session)) -> Token:
    
    # TODO: Password encryption
        
    user = crud.user.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    
    if not user:
        raise HTTPException(status_code=400, detail="User with this email or username do not exists.")
    
    access_token_expires = timedelta(minutes=settings.TOKEN_EXPIRE_TIME)
    
    return Token(
        access_token=create_access_token(
            user.id,
            expires_delta=access_token_expires
            )
        )