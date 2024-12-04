from app.models.comment import CommentOutHome
from .deps import *
from .filter import Filter
from .user import User, UserOutHome
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
    filter_ids: Optional[list[int]] = []

class PostUpdate(SQLModel):
    description: str | None = None
    filter_ids: Optional[list[int]] = None

class PostFiltersOut(SQLModel):
    post: Post
    filters: list[Filter] = []
    like_set: bool = False
    message: str | None = None

class PostFiltersOutList(SQLModel):
    posts: list[PostFiltersOut] = []
    message: str | None = None

class PostOutHomeOnly(SQLModel):
    id: int
    likes: int = 0
    description: str
    created_at: datetime

class PostOutHome(SQLModel):
    user: UserOutHome
    post: PostOutHomeOnly
    like_set: bool = False # If the user has liked the post
    book: Book
    n_comments: int = 0
    comments: list[CommentOutHome] = []
    filters: list[int] = []

class testtest(SQLModel):
    id: int
    likes : int = 0
    created_at : datetime