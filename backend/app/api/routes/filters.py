import os
from fastapi import (APIRouter, File, HTTPException, Depends, UploadFile)
from fastapi.responses import FileResponse
from sqlmodel import Session

from app.core.database import get_session
from app.models import (
    Filter
)
from app import crud, utils

router = APIRouter()

# Get all posts endpoint
@router.get("/all")
def get_all_filters(session: Session = Depends(get_session)):
    filters = crud.filter.get_all_filters(session=session)
    return filters