from datetime import datetime, timedelta
from typing import Any
from jose import jwt

from passlib.context import CryptContext
from app.core.config import settings

pwd_crypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
    return pwd_crypt.verify(userLogin_password, user_password)

def get_password_hash(password: str) -> str:
    return pwd_crypt.hash(password)
