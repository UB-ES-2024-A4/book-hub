from .deps import *


# Shared properties
class Followers(SQLModel, table=True):
    follower_id: Optional[int] = Field(foreign_key="user.id", primary_key=True, ondelete="CASCADE")
    followee_id: Optional[int] = Field(foreign_key="user.id", primary_key=True, ondelete="CASCADE")


# Information for a follower/followee to be shown in the list
class FollowerOut(SQLModel):
    id: int             # user id of the follower/followee
    username: str       # username of the follower/followee
    #profile_picture: Optional[str] = None


# List of followers or followees with a count
class FollowersOut(SQLModel):
    followers: list[FollowerOut]
    count: int


# Class to represent the action of following another user
class FollowersActionResponse(SQLModel):
    success: bool
    message: str
    #follow: Optional[FollowersOut] = None
 