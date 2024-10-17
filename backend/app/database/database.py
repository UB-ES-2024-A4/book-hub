from sqlmodel import Session, create_engine

DATABASE_URL = "dialect://username:password@host:port/database"

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
