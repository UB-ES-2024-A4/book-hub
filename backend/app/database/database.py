from sqlmodel import Session, create_engine

import os
from dotenv import load_dotenv
import sys

# Carga las variables de entorno desde el archivo .env
load_dotenv()

# Guardamos en la variable global la url de la base de datos.
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    sys.exit("Error .env DATABASE_URL is None, add it to the .env file")

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
