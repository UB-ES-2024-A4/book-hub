from datetime import datetime, timedelta
from typing import Any
from jose import jwt
from app.core.config import settings


ALGORITHM = "HS256"

def create_access_token(subject: str | Any, expires_delta: timedelta = settings.TOKEN_EXPIRE_TIME) -> str:
    """
        Esta funcion encripta los datos expire y sub (user.id), para crear el token
    """
    expire = datetime.now().timestamp() + int(expires_delta.total_seconds())
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(user_password: str, userLogin_password: str) -> bool:
    # print(user_password, userLogin_password)
    print(user_password, userLogin_password)
    return user_password == userLogin_password