from fastapi import (APIRouter, HTTPException, Depends)
from sqlmodel import Session
from app.models.account_info import PostRepository
from app.core.database import get_session
from app.models.user import User
from app.api.deps import (get_optional_user, get_current_user)

router = APIRouter()

@router.get("/{user_id}",
            dependencies=[Depends(get_optional_user), Depends(get_session)])
def get_account(user_id : int, session: Session = Depends(get_session), user : User = Depends(get_optional_user)):

    if session.get(User, user_id) is None:
        raise HTTPException(status_code=404, detail="User not found.")

    try:
        return PostRepository(session).get_user_posts_with_comments(user.id if user else None, user_id)
    except Exception:
        raise HTTPException(status_code=500, detail="An error occurred while retrieving posts")
    
@router.get("/liked/",
            dependencies=[Depends(get_current_user), Depends(get_session)])
def get_posts_liked(session: Session = Depends(get_session), user : User = Depends(get_current_user)):

    # try:
    return PostRepository(session).get_liked_posts_by_user(user.id)
    # except Exception:
    #     raise HTTPException(status_code=500, detail="An error occurred while retrieving posts")