from .deps import *

from .user import User
from .post import Post

class Like(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    post_id: int = Field(foreign_key="post.id", ondelete="CASCADE")

    user: Optional[User] = Relationship(back_populates="like")
    post: Optional[Post] = Relationship(back_populates="like")