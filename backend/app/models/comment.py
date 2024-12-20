from .deps import *

from .user import User, UserOutHome

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    post_id: int = Field(foreign_key="post.id", ondelete="CASCADE")
    comment: str
    created_at: datetime = Field(default_factory=datetime.now)

    user: User = Relationship(back_populates="comments")
    post: "Post" = Relationship(back_populates="comments")

class CommentOutHome(SQLModel):
    id: int
    user: UserOutHome
    comment: str
    created_at: datetime

class CommentCreate(SQLModel):
    post_id: int
    comment: str
    created_at: datetime | None = None