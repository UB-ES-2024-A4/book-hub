""" Search related CRUD methods """
from sqlmodel import Session, select
from app.models import User


def search_users_in_db(query: str, session: Session):
    """
    Perform a search for users in the database based on the query string.
    Returns matching users sorted alphabetically.
    """
    statement = (
        select(User)
        .where(User.username.ilike(f"%{query}%") | User.first_name.ilike(f"%{query}%"))
        .order_by(User.username.asc())
    )
    users = session.exec(statement).all()
    return users