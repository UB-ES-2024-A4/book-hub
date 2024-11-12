from typing import Any, Annotated
from app.core.security import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import (APIRouter, HTTPException, Depends)
from sqlmodel import Session
from datetime import timedelta

from app.core.database import get_session
from app.core.config import settings
from app.models.user import (
    User,
    UserOut,
    UsersOut,
)
from app.models.followers import (
    Followers,
    FollowerOut,
    FollowersOut

)
from app.api.deps import get_current_user
from app import crud, utils

router = APIRouter()

# Follow another user
@router.post(
    "/follow/{followee_id}",
    #dependencies=[Depends(get_current_user)],
    #response_model=FollowersOut
)
def follow_user(
    followee_id: int, 
    session: Session = Depends(get_session), 
    current_user: User = Depends(get_current_user)
):
    try:
        # Check if the user is trying to follow themselves
        if current_user.id == followee_id:
            raise ValueError("Cannot follow yourself.")
        
        user_exists = crud.user.get_user_by_id(session=session, id=followee_id)
        if not user_exists:
            raise ValueError("The user you are trying to follow does not exists.")
  
        # Attempt to create a follow relationship
        follow = crud.followers.follow_user(
            session=session, 
            follower_id=current_user.id, 
            followee_id=followee_id
        )      
        return {"message": "Followed successfully.", "followee_id": followee_id}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

# Get followers of a user
@router.get(
    "/followers/{user_id}",
    response_model=FollowersOut
)
def get_followers(
    user_id: int,
    session: Session = Depends(get_session)
):
    try:
        user_exists = crud.user.get_user_by_id(session=session, id=user_id)
        if not user_exists:
            raise ValueError("The user does not exists.")
    
        followers_data = crud.followers.get_followers(session=session, user_id=user_id)
        if not followers_data:
            raise ValueError("No followers found for this user.")
        return FollowersOut(followers=followers_data, count=len(followers_data))
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



