"""Biography column

Revision ID: 7ac7b21bf041
Revises: a5f2a9de6fdf
Create Date: 2024-10-24 23:35:34.767937

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '7ac7b21bf041'
down_revision: Union[str, None] = 'a5f2a9de6fdf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user', sa.Column('biography', sa.Text))


def downgrade() -> None:
    op.drop_column('user', 'biography')
