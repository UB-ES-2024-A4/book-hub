from .deps import *
from pydantic import model_validator
from .deps import (
    SQLModel,
    Field,
    Optional
)
from .user import User

# Base class for UserFollow 
class UserFollowBase(SQLModel):
    follower_id: int = Field(foreign_key="user.id")
    followee_id: int = Field(foreign_key="user.id")


class UserFollow(UserFollowBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)

    follower: "User" = Relationship(back_populates="following")  # type: ignore
    followee: "User" = Relationship(back_populates="followers")  # type: ignore


# Class for creating a new follow relationship (when a user follows another user)
class UserFollowCreate(UserFollowBase):
    pass


# Class for updating an existing follow relationship (if necessary)
class UserFollowUpdate(UserFollowBase):
    pass


# Class for the response of a user follow action (such as after following)
class UserFollowOut(SQLModel):
    id: int
    follower_id: int
    followee_id: int
    created_at: datetime


# Class to represent the action of a user following another (custom response model)
class UserFollowActionResponse(SQLModel):
    success: bool
    message: str
    follow: Optional[UserFollowOut]
    