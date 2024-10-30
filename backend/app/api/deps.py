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

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/login/access-token")


def get_current_user(token: str = Depends(reusable_oauth2), session: Session = Depends(get_session)) -> User:
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
