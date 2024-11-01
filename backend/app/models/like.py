from .deps import *

from .user import User
from .post import Post

class Like(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE", primary_key=True)
    post_id: int = Field(foreign_key="post.id", ondelete="CASCADE", primary_key=True)

    user: Optional[User] = Relationship(back_populates="like")
    post: Optional[Post] = Relationship(back_populates="like")