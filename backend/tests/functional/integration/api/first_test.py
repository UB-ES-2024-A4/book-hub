from fastapi.testclient import TestClient

from app.models.user import User
from sqlmodel import Session, select

def test_dbb_check(db : Session) -> None:

    username = "TEST_NAME"

    # Comprobamos que el user esta xen la base de datos.
    user = db.exec(
        select(User).where(User.username == username)
    ).first()

    assert user != None
    assert str(user.username) == username