""" Main API routes definition """
from fastapi import APIRouter

from app.api.routes import users, posts, books, filters, followers, home

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(filters.router, prefix="/filters", tags=["filters"])
api_router.include_router(followers.router, prefix="/followers", tags=["followers"])
api_router.include_router(home.router, prefix="/home", tags=["home"])