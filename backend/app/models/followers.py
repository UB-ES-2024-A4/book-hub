from .deps import *


# Shared properties
class Followers(SQLModel, table=True):
    follower_id: Optional[int] = Field(foreign_key="user.id", primary_key=True, ondelete="CASCADE")
    followee_id: Optional[int] = Field(foreign_key="user.id", primary_key=True, ondelete="CASCADE")
