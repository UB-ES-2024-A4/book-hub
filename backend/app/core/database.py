from sqlmodel import Session, create_engine
from app.core.config import settings

# Creamos el engine conectando con la base de datos.
engine = create_engine(settings.DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
