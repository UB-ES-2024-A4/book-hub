from .deps import *

from .user import User
from .post import Post

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    post_id: int = Field(foreign_key="post.id", ondelete="CASCADE")
    comment: str
    created_at: datetime = Field(default_factory=datetime.now)

    user: User = Relationship(back_populates="comment")
    post: Post = Relationship(back_populates="comment")