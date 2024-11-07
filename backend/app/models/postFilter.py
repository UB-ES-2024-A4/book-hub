from .deps import (
    Field,
    SQLModel
)

class PostFilter(SQLModel, table=True):
    post_id: int = Field(foreign_key="post.id", primary_key=True, ondelete="CASCADE")
    filter_id: int = Field(foreign_key="filter.id", primary_key=True)