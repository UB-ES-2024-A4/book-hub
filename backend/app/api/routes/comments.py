import os
from fastapi import (APIRouter, File, HTTPException, Depends, UploadFile)
from fastapi.responses import FileResponse
from sqlmodel import Session

from app.core.database import get_session
from app.models import (
    Post, 
    Comment,
    User
)
from app import crud, utils
from app.api.deps import (get_current_user)

router = APIRouter()

# Create comment endpoint
@router.post("/",
             dependencies=[Depends(get_current_user)])
def create_comment(new_comment: Comment, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    utils.check_ownership(current_usr_id=current_user.id, check_usr_id=new_comment.user_id)

    utils.check_existence_post(post_id=new_comment.post_id, session=session)

    comment = crud.comment.create_comment(session=session, comment_create=new_comment)

    return {"message": "Comment created successfully", "data": comment}
