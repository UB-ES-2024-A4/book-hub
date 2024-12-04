from app.api.deps import get_current_user
from app.core.database import get_session
from app.models.post import PostOutHome
from app.models.user import User
from fastapi import (APIRouter, Depends, HTTPException)
from sqlmodel import Session

from app.utils import get_home_posts_for_user

router = APIRouter()


@router.get("/",
              response_model=list[PostOutHome],
              dependencies=[Depends(get_session)]
              )
def get_home_posts(skip: int = 0,
                    limit : int = 0,
                    filters: str = "",
                    user: User = Depends(get_current_user),
                    session: Session = Depends(get_session)):

    try:
        return get_home_posts_for_user(session=session, 
                                        user=user,
                                        skip=skip,
                                        limit=limit,
                                        filters=filters)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Something went wrong, retrive post is not posible")
    