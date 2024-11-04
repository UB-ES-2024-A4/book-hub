from .deps import *
from .user import User
from .book import Book
from .postFilter import PostFilter

class PostBase(SQLModel):
    book_id: int = Field(foreign_key="book.id")
    user_id: Optional[int] = Field(foreign_key="user.id", ondelete="CASCADE")
    description: str
    likes: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.now)

class Post(PostBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user: Optional[User] = Relationship(back_populates="posts")
    book: Optional[Book] = Relationship(back_populates="posts")
    filters: list["Filter"] = Relationship(back_populates="posts", link_model=PostFilter) # type: ignore
    comments: list["Comment"] = Relationship(back_populates="post", cascade_delete=True) # type: ignore

class PostCreate(PostBase):
    pass

class PostUpdate(SQLModel):
    description: str | None = None