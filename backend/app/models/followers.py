from pydantic import model_validator
from .deps import (
    SQLModel,
    Field,
    Optional
)
from .user import User

# Shared properties
class Followers(SQLModel, table=True):
    user_id: Optional[int] = Field(index=True, foreign_key="user.id", primary_key=True, ondelete="CASCADE")
    following_id: Optional[int] = Field(index=True, foreign_key="user.id", primary_key=True, ondelete="CASCADE")
    
class FollowersOut(SQLModel):
    user: User
    following: list[User]
    count: int = 0