from .database import engine
from .models import SQLModel
from .api.main import api_router
from .core.config import settings

from fastapi import FastAPI

app = FastAPI(title=settings.APP_NAME)

# Crear la base de datos y las tablas
def on_startup():
    SQLModel.metadata.create_all(engine)

app.add_event_handler("startup", on_startup)

app.include_router(api_router)