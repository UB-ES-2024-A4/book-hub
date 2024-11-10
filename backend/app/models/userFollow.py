from .deps import *
from pydantic import model_validator
from .deps import (
    SQLModel,
    Field,
    Optional
)

# Base class for UserFollow 
class UserFollowBase(SQLModel):
    follower_id: int = Field(foreign_key="user.id")
    followee_id: int = Field(foreign_key="user.id")


class UserFollow(UserFollowBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)

    # Explicitly define foreign_keys for each relationship to avoid ambiguity
    follower: "User" = Relationship(
        back_populates="following",
        sa_relationship_kwargs={"foreign_keys": "UserFollow.follower_id"}
    )
    followee: "User" = Relationship(
        back_populates="followers",
        sa_relationship_kwargs={"foreign_keys": "UserFollow.followee_id"}
    )


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
    