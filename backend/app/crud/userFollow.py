""" UserFollow related CRUD methods """
from typing import Any
from sqlmodel import Session, select
from app.models import UserFollow, UserFollowCreate, UserFollowUpdate, User, UserCreate, UserUpdate
from app.core.security import verify_password
from sqlalchemy import or_
from datetime import datetime

# Create
def follow_user(*, session: Session, user_follow_create: UserFollowCreate) -> UserFollow:
    # Check if already following to avoid duplicates
    existing_follow = is_following(
        session=session,
        follower_id=user_follow_create.follower_id,
        followee_id=user_follow_create.followee_id
    )
    
    if existing_follow:
        raise ValueError("You are already following this user.")
        return existing_follow  # Or raise an error if duplicate follows aren't allowed
    
    # Create a new follow record
    new_follow = UserFollow(
        follower_id=user_follow_create.follower_id, 
        followee_id=user_follow_create.followee_id,
        created_at=datetime.now()
    )

    session.add(new_follow)
    session.commit()
    session.refresh(new_follow)
    return new_follow


# Remove
def unfollow_user(*, session: Session, user_follow_update: UserFollowUpdate) -> bool:
    follow = is_following(
        session=session,
        follower_id=user_follow_update.follower_id,
        followee_id=user_follow_update.followee_id
    )
    
    if not follow:
        raise ValueError("You are not following this user.")
    
    # Remove the follow relation
    session.delete(follow)
    session.commit()
    return True


# Check if a user is following another
def is_following(*, session: Session, follower_id: int, followee_id: int) -> bool:
    follow_relation = session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == follower_id,
            UserFollow.followee_id == followee_id
            )
        ).first()
    return follow_relation is not None


# Get follower count for a user
def get_follower_count(session: Session, user_id: int) -> int:
    count = session.exec(
        select(UserFollow).where(UserFollow.followee_id == user_id)
    ).count()
    return count


# Get followee count for a user
def get_followee_count(session: Session, user_id: int) -> int:
    count = session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == user_id
        )
    ).count()

    return count


# Retrieve followers of a user
def get_followers(session: Session, user_id: int) -> list[User]:
    followers = session.exec(
        select(User).join(
            UserFollow, UserFollow.follower_id == User.id
        ).where(
            UserFollow.followee_id == user_id
        )
    ).all()

    return followers


# Retrieve users followed by a user
def get_followees(session: Session, user_id: int) -> list[User]:
    followees = session.exec(
        select(User).join(
            UserFollow, UserFollow.followee_id == User.id
        ).where(
            UserFollow.follower_id == user_id
        )
    ).all()
    
    return followees