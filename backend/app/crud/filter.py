""" Filter related CRUD methods """
from typing import Any
from sqlmodel import Session, select, delete
from app.models import Filter

def get_all_filters(*, session: Session) -> Any:
    filters = session.exec(select(Filter)).all()
    return filters
