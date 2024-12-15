from fastapi import (APIRouter, HTTPException, Depends)
from sqlmodel import Session

from app.core.database import get_session
from app.models.user import User
from app.utils import get_account_posts
from app.api.deps import (get_current_user)

router = APIRouter()

@router.get("/{user_id}",
            dependencies=[Depends(get_current_user), Depends(get_session)])
def get_account(user_id : int, session: Session = Depends(get_session), user : User = Depends(get_current_user)):
    
    return get_account_posts(session=session, user_id=user.id, user_id_acc=user_id)