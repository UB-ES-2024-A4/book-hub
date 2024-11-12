""" Followers related CRUD methods """
from sqlmodel import Session, select
from app.models import (
    Followers,
    FollowerOut
)

# Create
def follow_user(*, session: Session, follower_id: int, followee_id: int) -> Followers:
    """Creates a follow relationship between two users if not already following."""
    existing_follow = is_following(
        session=session, 
        follower_id=follower_id, 
        followee_id=followee_id
        )
    
    if existing_follow:
        raise ValueError("You are already following this user.")
    
    # Create a new follow record
    new_follow = Followers(
        follower_id=follower_id, 
        followee_id=followee_id
        )
    
    session.add(new_follow)
    session.commit()
    session.refresh(new_follow)
    return new_follow


# Remove
def unfollow_user(*, session: Session, follower_id: int, followee_id: int) -> bool:
    """Removes an existing follow relationship between two users if exists."""
    follow = is_following(
        session=session,
        follower_id=follower_id,
        followee_id=followee_id
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
        select(Followers).where(
            Followers.follower_id == follower_id,
            Followers.followee_id == followee_id
            )
        ).first()
    return follow_relation is not None


# Get follower count for a user
def get_follower_count(session: Session, user_id: int) -> int:
    """Returns the count of followers for a specific user."""
    count = session.exec(
        select(Followers).where(Followers.followee_id == user_id)
    ).count()
    return count


# Get followee count for a user
def get_followee_count(session: Session, user_id: int) -> int:
    """Returns the count of followees for a specific user."""
    count = session.exec(
        select(Followers).where(
            Followers.follower_id == user_id
        )
    ).count()

    return count


# Retrieve followers of a user
def get_followers(session: Session, user_id: int) -> list[FollowerOut]:
    """Retrieves the list of follower relationships for a specific user, returning only necessary data."""
    followers = session.exec(
        select(Followers).where(Followers.followee_id == user_id)
    ).all()
    
    # Convert each Followers entry to a FollowerOut instance
    followers_data = [FollowerOut(follower_id=f.follower_id, followee_id=f.followee_id) for f in followers]
    
    return followers_data


# Retrieve users followed by a user
def get_followees(session: Session, user_id: int) -> list[FollowerOut]:
    """Retrieves the list of users a specific user is following, returning only necessary data."""
    followees = session.exec(
        select(Followers).where(Followers.follower_id == user_id)
    ).all()
    
    # Convert each Followers entry to a FolloweeOut instance
    followees_data = [FollowerOut(follower_id=f.follower_id, followee_id=f.followee_id) for f in followees]
    
    return followees_data