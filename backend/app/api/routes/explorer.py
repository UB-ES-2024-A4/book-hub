from app.api.deps import get_optional_user
from app.core.database import get_session
from app.models.post import PostOutHome
from app.models.user import User
from fastapi import (APIRouter, Depends, HTTPException)
from sqlmodel import Session

from app.utils import get_explorer_posts

router = APIRouter()

@router.get("/",
              response_model=list[PostOutHome],
              dependencies=[Depends(get_session)]
              )
def get_explorers_posts(skip: int = 0,
                    limit : int = 10,
                    filters: str = "",
                    user: User = Depends(get_optional_user),
                    session: Session = Depends(get_session)):
    
    try:
        return get_explorer_posts(session=session, user=user, skip=skip, limit=limit, filters=filters)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Something went wrong, retrive post is not posible")
