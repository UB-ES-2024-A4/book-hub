from sqlmodel import Field
from typing import Optional
from .base import SQLModel

from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Shared properties
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    username : str = Field(unique=True, index=True)

    first_name: str | None = None
    laset_name: str | None = None

# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password : str

class UserCreate(UserBase):
    email: str 
    username : str

    first_name: str
    laset_name: str


class UserUpdate(SQLModel):
    username: str | None = None


class UserOut(UserBase):
    id: int

class UsersOut(SQLModel):
    users: list[UserOut]