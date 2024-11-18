import os
from fastapi import (APIRouter, File, HTTPException, Depends, UploadFile)
from fastapi.responses import FileResponse
from sqlmodel import Session

from app.core.database import get_session
from app.models import (
    Post, 
    Comment,
    CommentCreate,
    User
)
from app import crud, utils
from app.api.deps import (get_current_user)

router = APIRouter()

# Create comment endpoint
@router.post("/",
             dependencies=[Depends(get_current_user)])
def create_comment(new_comment: CommentCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    utils.check_existence_post(post_id=new_comment.post_id, session=session)

    comment = crud.comment.create_comment(session=session, comment_create=new_comment, usr_id=current_user.id)

    return {"message": "Comment created successfully", "data": comment}

# Get all comment for a post endpoint
@router.get("/{post_id}")
def get_all_posts(post_id: int, session: Session = Depends(get_session)):
    utils.check_existence_post(post_id=post_id, session=session)

    posts = crud.comment.get_all_comments_by_post(session=session, post_id=post_id)
    return posts

# Delete comment
@router.delete("/{comment_id}",
             dependencies=[Depends(get_current_user)])
def delete_comment(comment_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_comment: Comment = utils.check_existence_comment(comment_id=comment_id, session=session)
    
    utils.check_ownership(current_usr_id=current_user.id, check_usr_id=db_comment.user_id)

    comment = crud.comment.delete_comment(session=session, db_comment=db_comment)

    return {"message": "Comment deleted successfully", "data": comment}