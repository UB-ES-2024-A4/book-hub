
from app.api.deps import get_current_user
from app.core.database import get_session
from fastapi import APIRouter, Depends, HTTPException
from app.crud.comment import *
from app.models.user import User

router = APIRouter()

@router.get("/{post_id}",
           dependencies=[Depends(get_current_user),
                         Depends(get_session)])
def get_posts_comments(post_id: int = 1, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    try:
        return get_post_comments(session, post_id, user)
    except:
        raise HTTPException(status_code=404, detail="An error occoured while fetching comments.")


@router.post("/",
            dependencies=[Depends(get_current_user),
                         Depends(get_session)])
def create_comment(comment: CommentCreate, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    """
    try:
    except:
        raise HTTPException(status_code=400, detail="An error occoured while creating comment.")
    """
    return create_comment_post(session, comment, user)