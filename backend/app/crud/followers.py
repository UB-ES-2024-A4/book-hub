""" Followers related CRUD methods """
from sqlalchemy import func
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
    follow = session.exec(
        select(Followers).where(
            Followers.follower_id == follower_id,
            Followers.followee_id == followee_id
            )
        ).first()
    
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
def get_followee_count(session: Session, user_id: int) -> int:
    """Returns the count of followers for a specific user."""
    return len(get_followees(session=session, user_id=user_id))
    

# Get followee count for a user
def get_follower_count(session: Session, user_id: int) -> int:
    """Returns the count of followees for a specific user."""
    return len(get_followers(session=session, user_id=user_id))


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


def get_mutual_followers(session: Session, user_id_1: int, user_id_2: int) -> list[FollowerOut]:
    """Retrieves mutual followers between two users."""
    
    # Get followers of user 1
    user_1_followers = get_followers(session=session, user_id=user_id_1)

    # Get followers of user 2
    user_2_followers = get_followers(session=session, user_id=user_id_2)
    
    # Extract follower IDs from the results
    user_1_follower_ids = {follower.id for follower in user_1_followers}
    user_2_follower_ids = {follower.id for follower in user_2_followers}

    # Find mutual follower IDs
    mutual_follower_ids = user_1_follower_ids & user_2_follower_ids

    # If there are no mutual followers, return an empty list
    if not mutual_follower_ids:
        return []

    # Retrieve user information for each mutual follower
    mutual_followers_data = session.exec(
        select(User).where(User.id.in_(mutual_follower_ids))
    ).all()

    # Convert each user to FollowerOut
    mutual_followers_info = [
        FollowerOut(id=user.id, username=user.username)
        for user in mutual_followers_data
    ]
    
    return mutual_followers_info


def get_most_followed_users(session: Session, limit: int = 10) -> list[dict]:
    """Retrieve the users with the most followers."""
    # Create the query to get the count of followers per followee (most followed users)
    statement = (
        select(Followers.followee_id, func.count(Followers.follower_id).label('followers_count'))
        .group_by(Followers.followee_id)
        .order_by(func.count(Followers.follower_id).desc())
        .limit(limit)
    )

    # Execute the query
    most_followed = session.exec(statement).all()

    # Retrieve the user information for the most followed users
    followee_ids = [entry.followee_id for entry in most_followed]
    users_data = session.exec(select(User).where(User.id.in_(followee_ids))).all()

    # Combine the data: user details with follower count and return as personalized list
    most_followed_users = [
        {
            'user_id': user.id,
            'username': user.username,
            'followers_count': followers_count
        }
        for user, followers_count in zip(users_data, [entry.followers_count for entry in most_followed])
    ]

    return most_followed_users
