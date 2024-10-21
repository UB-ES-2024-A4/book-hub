from fastapi import APIRouter
from fastapi import Depends
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import User

router = APIRouter()

# Endpoint para obtener el primer usuario
# Este es un endpoint dummy, para probar que la API funciona.
@router.get("/")
def get_first_user(session: Session = Depends(get_session)):
    result = session.exec(select(User)).first()
    if result:
        return {"name": result.name}
    return {"error": "No users found"}
