""" Authenticated related dependencies """
from fastapi import Depends, HTTPException, status
from app.core.database import get_session
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.models import User, UserLogout
from datetime import datetime

reusable_oauth2 : OAuth2PasswordBearer = OAuth2PasswordBearer(tokenUrl="/users/login/access-token")
reusable_optional_oauth2 = OAuth2PasswordBearer(tokenUrl="/users/login/access-token", auto_error=False)

def decode_token(token : str):
    payload = jwt.decode(
        token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
    )
    return payload

class BlackList(dict):
    def __init__(self):
        self.blacklist : dict = {}
        self.MAX : int = 10

    def add(self, token: str):
        self.blacklist[token] = decode_token(token)["exp"]

    def pop(self, token):
        return self.blacklist.pop(token)

    def __contains__(self, token):

        if self.__len__() >= self.MAX:
            # Remove expired tokens
            time = datetime.now().timestamp()
            self.blacklist = {k:v for k,v in self.blacklist.items() if v > time}

        return token in self.blacklist

    def __len__(self):
        return len(self.blacklist)

blacklist = BlackList()


def get_user(token: str | None, session: Session) -> User | None:
    if token == None: return None
    try:
        # Check if user is in the blacklist
        if token in blacklist: raise HTTPException(status_code=401, detail="This session is not valid.")

        token_data = decode_token(token)

    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    user = session.get(User, token_data.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def logout(token : str = Depends(reusable_oauth2)):
    try:
        blacklist.add(token)
    except:
        raise HTTPException(status_code=400, detail="Could not logout user successfully")

    return UserLogout(token=token, expired=False, msj="Logout successful")

def get_current_user(token: str = Depends(reusable_oauth2), session: Session = Depends(get_session)) -> User:
    return get_user(token, session)

# To users screen where beeing logged in is optional
def get_optional_user(token: str | None = Depends(reusable_optional_oauth2), session: Session = Depends(get_session)) -> User:
    return get_user(token, session)