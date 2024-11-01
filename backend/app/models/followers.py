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

    # Validación para evitar que el usuario se siga a sí mismo
    @model_validator(mode="before")
    def check_not_self_follow(cls, values):
        user_id = values.get("user_id")
        following_id = values.get("following_id")
        
        if user_id == following_id:
            raise ValueError("A user cannot follow themselves.")
        
        return values

class FollowersOut(SQLModel):
    user: User
    following: list[User]
    count: int = 0