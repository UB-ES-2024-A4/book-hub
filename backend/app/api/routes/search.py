from app.api.deps import get_current_user
from fastapi import APIRouter, Query, HTTPException, Depends
from app.core.database import get_session
from sqlalchemy.orm import Session
from app.models import UserOut, UsersOut
from app.crud import search

router = APIRouter()


@router.get(
        "/",
        dependencies=[Depends(get_current_user)],
        response_model=UsersOut
        )
def search_users(
    query: str = Query(..., min_length=3, description="Search input with at least 3 characters."),
    session: Session = Depends(get_session),
):
    """
    Endpoint to search for users based on a query string.
    Returns matching users sorted alphabetically.
    """
    try:
        users = search.search_users_in_db(query, session)

        if not users:
            return {"message": "No users found matching your search."}
        

        # Return a list of user details using UsersOut model
        return UsersOut(
            users=[
                UserOut(
                    id=user.id,
                    email=user.email,
                    username=user.username,
                    first_name=user.first_name,
                    last_name=user.last_name,
                    biography=user.biography
                )
                for user in users
            ]
        )

    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(status_code=404, detail="Something went wrong. Please try again later.")
