""" Main API routes definition """
from fastapi import APIRouter

from app.api.routes import users, posts

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
