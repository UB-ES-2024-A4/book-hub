from fastapi.testclient import TestClient

from app.models.user import User
from sqlmodel import Session, select

def test_dbb_check(db : Session) -> None:

    username = "TEST_NAME"

    # Comprobamos que el user esta en la base de datos.
    user = db.exec(
        select(User).where(User.name == username)
    ).first()

    assert user != None
    assert str(user.name) == username

def test_api_check(client: TestClient) -> None:

    r = client.get(f"/users/")
    user = r.json()

    print("User: ", user)

    assert user["name"] == "TEST_NAME"
