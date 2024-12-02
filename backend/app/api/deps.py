""" Authenticated related dependencies """
from fastapi import Depends, HTTPException, status
from app.core.database import get_session
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.models import User, TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/users/login/access-token")
reusable_optional_oauth2 = OAuth2PasswordBearer(tokenUrl="/users/login/access-token", auto_error=False)

def get_user(token: str | None, session: Session) -> User:
    if token == None: return None
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

def get_current_user(token: str = Depends(reusable_oauth2), session: Session = Depends(get_session)) -> User:
    return get_user(token, session)

# To users screen where beeing logged in is optional
def get_optional_user(token: str | None = Depends(reusable_optional_oauth2), session: Session = Depends(get_session)) -> User:
    return get_user(token, session)