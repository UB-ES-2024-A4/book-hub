from fastapi import (APIRouter, HTTPException, Depends)
from sqlmodel import Session

from app.core.database import get_session
from app.models import (
    User,
    FollowersOut,
    FollowersActionResponse
)

from app.api.deps import get_current_user
from app import crud

router = APIRouter()


# Get followers of a user
@router.get (
    "/get_followers/{user_id}",
    response_model=FollowersOut
)
def get_followers(user_id: int, session: Session = Depends(get_session)):

    user_exists = crud.user.get_user_by_id(session=session, id=user_id)
    if not user_exists:
        raise HTTPException(status_code=400, detail="The user does not exists.")

    followers_data = crud.followers.get_followers(session=session, user_id=user_id)
    if not followers_data:
        raise HTTPException(status_code=400, detail="No followers found for this user.")
    return FollowersOut(followers=followers_data, count=len(followers_data))


# Get followees of a user (following)
@router.get (
    "/get_followings/{user_id}",
    response_model=FollowersOut
)
def get_followees(user_id: int, session: Session = Depends(get_session)):

    user_exists = crud.user.get_user_by_id(session=session, id=user_id)
    if not user_exists:
        raise HTTPException(status_code=400, detail="The user does not exists.")
    
    followees_data = crud.followers.get_followees(session=session, user_id=user_id)
    if not followees_data:
        raise HTTPException(status_code=400, detail="No followees found for this user.")
    return FollowersOut(followers=followees_data, count=len(followees_data))



# Follow another user
@router.post (
    "/follow/{followee_id}",
    #dependencies=[Depends(get_current_user)],
    response_model=FollowersActionResponse
)
def follow_user (
    followee_id: int, 
    session: Session = Depends(get_session), 
    current_user: User = Depends(get_current_user)
):
    # Check if the user is trying to follow themselves
    if current_user.id == followee_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself.")
    
    user_exists = crud.user.get_user_by_id(session=session, id=followee_id)
    if not user_exists:
        raise HTTPException(status_code=400, detail="The user you are trying to follow does not exists.")

    # Attempt to create a follow relationship
    follow = crud.followers.follow_user(
        session=session, 
        follower_id=current_user.id, 
        followee_id=followee_id
    )      
    return FollowersActionResponse(success=True, message="User followed successfully")


# Unfollow a user
@router.post (
    "/unfollow/{followee_id}",
    #dependencies=[Depends(get_current_user)],
    response_model=FollowersActionResponse
)
def unfollow_user (
    followee_id: int, 
    session: Session = Depends(get_session), 
    current_user: User = Depends(get_current_user)
):
    # Check if the user is trying to unfollow themselves
    if current_user.id == followee_id:
        raise HTTPException(status_code=400, detail="Cannot unfollow yourself.")
    
    user_exists = crud.user.get_user_by_id(session=session, id=followee_id)
    if not user_exists:
        raise HTTPException(status_code=400, detail="The user you are trying to unfollow does not exists.")

    # Attempt to remove the follow relationship
    unfollowed = crud.followers.unfollow_user(
        session=session, 
        follower_id=current_user.id, 
        followee_id=followee_id
    )
    if unfollowed:      
        return FollowersActionResponse(success=True, message="User unfollowed successfully")
    else:
        return FollowersActionResponse(success=False, message="An error ocurred while unfollowing user")
    

# Additional endpoints for more usability

# Get follower count for a user
@router.get("/count/followers/{user_id}", response_model=int)
def get_followers_count(user_id: int, session: Session = Depends(get_session)):
    try:
        followers_count = crud.followers.get_follower_count(session=session, user_id=user_id)
        return followers_count
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Get followee count for a user
@router.get("/count/following/{user_id}", response_model=int)
def get_followee_count(user_id: int, session: Session = Depends(get_session)):
    try:
        followees_count = crud.followers.get_followee_count(session=session, user_id=user_id)
        return followees_count
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# This endpoint is to retrieve the mutual followers between two users. 
# This is useful for social connections.
@router.get(
    "/mutual-followers/{user_id_1}/{user_id_2}",
    response_model=FollowersOut
)
def get_mutual_followers(
    user_id_1: int, user_id_2: int, 
    session: Session = Depends(get_session)
):
    
    user_exists_1 = crud.user.get_user_by_id(session=session, id=user_id_1)
    user_exists_2 = crud.user.get_user_by_id(session=session, id=user_id_2)
    if not user_exists_1 or not user_exists_2:
        raise HTTPException(status_code=400, detail="One or both users do not exist.")

    mutual_followers = crud.followers.get_mutual_followers(
        session=session, user_id_1=user_id_1, user_id_2=user_id_2
    )
    if not mutual_followers:
        raise HTTPException(status_code=404, detail="No mutual followers found.")
    return FollowersOut(followers=mutual_followers, count=len(mutual_followers))


# This endpoint returns a list of the users with the most followers. 
# It's useful for discovering popular users.
@router.get(
    "/most-followed",
    # response_model=UsersOut
)
def get_most_followed_users(limit:int = 10, session: Session = Depends(get_session)):

    most_followed_users = crud.followers.get_most_followed_users(session=session, limit=limit)
    if not most_followed_users:
        raise HTTPException(status_code=400, detail="No users found.")
    return most_followed_users
    
    