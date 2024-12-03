
from app.api.deps import get_current_user
from app.core.database import get_session
from fastapi import APIRouter, Depends, HTTPException
from app.crud import comment as crud_comment
from app.models.comment import Comment, CommentCreate, CommentOutHome
from sqlmodel import Session
from app.models.user import User

router = APIRouter()

@router.get("/{post_id}",
           dependencies=[Depends(get_current_user),
                         Depends(get_session)],
           response_model=list[CommentOutHome])
def get_posts_comments(post_id: int = 1, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    try:
        return crud_comment.get_post_comments(session, post_id, user)
    except:
        raise HTTPException(status_code=404, detail="An error occoured while fetching comments.")


@router.post("/",
            dependencies=[Depends(get_current_user),
                         Depends(get_session)])
def create_comment(comment: CommentCreate, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    try:
        return crud_comment.create_comment_post(session, comment, user)
    except:
        raise HTTPException(status_code=400, detail="An error occoured while creating comment.")

@router.delete("/{comment_id}",
               dependencies=[Depends(get_current_user),
                             Depends(get_session)],
               response_model=Comment)

def delete_comment(comment_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    try:
        return crud_comment.delete_comment(session, comment_id, user)
    except ValueError as e:
        raise HTTPException(status_code=e.args[0], detail=e.args[1])
    except Exception as e:
        raise HTTPException(status_code=400, detail="An error occoured while deleting comment.")