from sqlmodel import Field
from typing import Optional
from .base import SQLModel

# Shared properties
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    username : str = Field(unique=True, index=True)

    first_name: str | None = None
    last_name: str | None = None

# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password : str

class UserCreate(UserBase):
    password: str

class Token(SQLModel):
    acces_token: str
    token_type: str = "bearer"

class UserLogin(SQLModel):
    username: str | None = None
    email: str | None = None
    password: str


class UserUpdate(SQLModel):
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None


class UserOut(UserBase):
    id: int

class UsersOut(SQLModel):
    users: list[UserOut]