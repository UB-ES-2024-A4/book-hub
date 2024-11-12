""" Followers related CRUD methods """
from sqlmodel import Session, select
from app.models import (
    User,
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
    return len(get_followers(session=session, user_id=user_id))
    

# Get followee count for a user
def get_followee_count(session: Session, user_id: int) -> int:
    """Returns the count of followees for a specific user."""
    return len(get_followees(session=session, user_id=user_id))


# Retrieve followers of a user
def get_followers(session: Session, user_id: int) -> list[FollowerOut]:
    """Retrieves the list of users following a specific user, returning only necessary data."""
    # Query the followers
    followers = session.exec(
        select(Followers.follower_id).where(Followers.followee_id == user_id)
    ).all()
    
    # If there are no followers, return an empty list
    if not followers:
        return []
    
    # Retrieve user information for each follower_id
    follower_ids = [f for f in followers]
    followers_data = session.exec(
        select(User).where(User.id.in_(follower_ids))
    ).all()

    # Convert each user to FollowerOut
    followers_info = [
        FollowerOut(id=user.id, username=user.username)
        for user in followers_data
    ]

    return followers_info


# Retrieve users followed by a user
def get_followees(session: Session, user_id: int) -> list[FollowerOut]:
    """Retrieves the list of users a specific user is following, returning only necessary data."""
    # Query the followees
    followees = session.exec(
        select(Followers.followee_id).where(Followers.follower_id == user_id)
    ).all()
    
    # If there are no followees, return an empty list
    if not followees:
        return []

    # Retrieve user information for each followee_id
    followee_ids = [f for f in followees]
    followees_data = session.exec(
        select(User).where(User.id.in_(followee_ids))
    ).all()

    # Convert each user to FollowerOut
    followees_info = [
        FollowerOut(id=user.id, username=user.username)
        for user in followees_data
    ]
    
    return followees_info
