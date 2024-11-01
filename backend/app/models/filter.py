from .deps import *
from .post import Post
from .postFilter import PostFilter

class Filter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, unique=True)

    posts: list[Post] = Relationship(back_populates="filters", link_model=PostFilter)
