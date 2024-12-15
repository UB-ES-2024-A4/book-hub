import os
from fastapi import (APIRouter, File, HTTPException, Depends, UploadFile)
from fastapi.responses import FileResponse
from sqlmodel import Session, select

from app.core.database import get_session
from app.models import (
    Like,
    User
)
from app import crud, utils
from app.api.deps import (get_current_user)

router = APIRouter()

# Create like endpoint
@router.post("/",
             dependencies=[Depends(get_current_user)])
def create_like(new_like: Like, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    utils.check_ownership(current_usr_id=current_user.id, check_usr_id=new_like.user_id)
    utils.check_existence_post(post_id=new_like.post_id, session=session)

    utils.check_post_liked(post_id=new_like.post_id, user_id=new_like.user_id, session=session, like=True)

    like = crud.like.create_like(session=session, like_create=new_like)
    return {"message": "Post liked successfully", "data": like}

# Delete like endpoint
@router.delete("/{post_id}&{user_id}",
             dependencies=[Depends(get_current_user)])
def delete_like(post_id: int, user_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):

    utils.check_ownership(current_usr_id=current_user.id, check_usr_id=user_id)

    utils.check_existence_post(post_id=post_id, session=session)

    utils.check_post_liked(post_id=post_id, user_id=user_id, session=session, like=False)

    db_like: Like = session.exec(select(Like).where(Like.user_id == user_id and Like.post_id == post_id)).first()

    like = crud.like.delete_like(session=session, db_like=db_like)

    return {"message": "Post unliked successfully", "data": like}