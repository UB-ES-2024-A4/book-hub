from .deps import *

class BookBase(SQLModel):
    title: str = Field(max_length=255)
    author: Optional[str] = Field(max_length=255)
    description: Optional[str]
    created_at: datetime = Field(default_factory=datetime.now)

class Book(BookBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    posts: list["Post"] = Relationship(back_populates="book", cascade_delete=True)

class BookCreate(BookBase):
    pass

class BookUpdate(SQLModel):
    title: str | None = None
    author: str | None = None
    description: str | None = None