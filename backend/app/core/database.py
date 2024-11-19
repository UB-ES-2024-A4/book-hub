from sqlmodel import Session, create_engine, select
from app.core.config import settings
from datetime import datetime

from app.models import User, Book, Filter

# Creamos el engine conectando con la base de datos.
engine = create_engine(str(settings.SQLALCHEMY_URI))


def get_session():
    with Session(engine) as session:
        yield session


def init_db(session: Session) -> None:
    # TODO Variables van al .env
    username = "TEST_NAME"
    first_name = "TEST_FIRST_NAME"
    last_name = "TEST_LAST_NAME"
    email = "test@test.com"
    password = "TestPassword"

    user = session.exec(
        select(User).where(User.username == username)
    ).first()

    if not user:
        session.add(User(username=username, email=email, password=password, first_name=first_name, last_name=last_name))
        session.commit()

    username = "TEST_NAME2"
    first_name = "TEST_FIRST_NAME2"
    last_name = "TEST_LAST_NAME2"
    email = "test2@test.com"
    password = "TestPassword2"

    user = session.exec(
        select(User).where(User.username == username)
    ).first()

    if not user:
        session.add(User(username=username, email=email, password=password, first_name=first_name, last_name=last_name))
        session.commit()

    title = 'TEST'
    author = 'TEST'
    description = 'TESTING'
    created_at = datetime.now()

    book = session.exec(
        select(Book).where(Book.title == title)
    ).first()

    if not book:
        session.add(Book(title=title, author=author, description=description, created_at=created_at))
        session.commit()
        
    name = 'TEST_FILTER'

    filter = session.exec(
        select(Filter).where(Filter.name == name)
    ).first()

    if not filter:
        session.add(Filter(name=name))
        session.commit()
