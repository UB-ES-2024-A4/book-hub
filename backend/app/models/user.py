from app.models.followers import Followers
from .deps import *


# Shared properties
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    username : str = Field(unique=True, index=True)

    first_name: str | None = None
    last_name: str | None = None
    biography: str | None = None

# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password: str = Field(max_length=255, nullable=False)
    created_at: datetime | None = Field(default_factory=datetime.now)

    posts: list["Post"] = Relationship(back_populates="user", cascade_delete=True) # type: ignore
    likes: list["Like"] = Relationship(back_populates="user", cascade_delete=True) # type: ignore
    comments: list["Comment"] = Relationship(back_populates="user", cascade_delete=True) # type: ignore

    following: list["User"] = Relationship(
        back_populates="followers",
        link_model=Followers,
        sa_relationship_kwargs={
            "primaryjoin": "User.id == Followers.follower_id",
            "secondaryjoin": "User.id == Followers.followee_id"
        }
    )
    
    followers: list["User"] = Relationship(
        back_populates="following",
        link_model=Followers,
        sa_relationship_kwargs={
            "primaryjoin": "User.id == Followers.followee_id",
            "secondaryjoin": "User.id == Followers.follower_id"
        }
    )

class UserCreate(UserBase):
    password: str

# Contents of JWT token
class TokenPayload(SQLModel):
    sub: int | None = None

class UserLogin(SQLModel):
    username: str | None = None
    email: str | None = None
    password: str


class UserUpdate(SQLModel):
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    biography: str | None = None


class UserOut(UserBase):
    id: int

class UsersOut(SQLModel):
    users: list[UserOut]

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut