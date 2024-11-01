from .deps import *

class Book(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    author: Optional[str] = Field(max_length=255)
    description: Optional[str]
    created_at: datetime = Field(default_factory=datetime.now)

    posts: list["Post"] = Relationship(back_populates="book") # type: ignore
