from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from .database import get_session, engine
from .models import User, SQLModel

app = FastAPI()

# Crear la base de datos y las tablas
def on_startup():
    SQLModel.metadata.create_all(engine)

app.add_event_handler("startup", on_startup)

# Endpoint para obtener el primer usuario
@app.get("/")
def get_first_user(session: Session = Depends(get_session)):
    statement = select(User)
    result = session.exec(statement).first()
    if result:
        return {"name": result.name}
    return {"error": "No users found"}
