from .deps import *


# Shared properties
class Followers(SQLModel, table=True):
    follower_id: Optional[int] = Field(foreign_key="user.id", primary_key=True, ondelete="CASCADE")
    followee_id: Optional[int] = Field(foreign_key="user.id", primary_key=True, ondelete="CASCADE")


class FollowerOut(SQLModel):
    follower_id: int


class FollowersOut(SQLModel):
    followers: list[FollowerOut]
    count: int


# Class to represent the action of a user following another (custom response model)
class FollowersActionResponse(SQLModel):
    success: bool
    message: str
    follow: Optional[FollowersOut] = None
 