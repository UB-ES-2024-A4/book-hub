"""Added UserFollow table and modified User model

Revision ID: 93a0eba87a7b
Revises: a3985b92b941
Create Date: 2024-11-09 00:51:01.463180

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '93a0eba87a7b'
down_revision: Union[str, None] = 'a3985b92b941'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
