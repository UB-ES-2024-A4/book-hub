from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select

from app import crud
from app.models import Filter

def test_get_all_filters(db: Session) -> None:
    filters = crud.filter.get_all_filters(session=db)

    assert filters
    for item in filters:
        assert item.name
        assert item.id
