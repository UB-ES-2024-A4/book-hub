from sqlmodel import Session, create_engine, select
from app.core.config import settings

from app.models.user import User
# Creamos el engine conectando con la base de datos.
engine = create_engine(settings.DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session

def init_db(session: Session) -> None:

    # TODO Variables van al .env
    username = "TEST_NAME"

    user = session.exec(
        select(User).where(User.name == username)
    ).first()

    if not user:
        session.add(User(name=username))
        session.commit()
    