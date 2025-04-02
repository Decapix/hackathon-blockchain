from fastapi import APIRouter
import logging

router = APIRouter()

@router.get("/")
async def home(n: int = 10):
    """home"""
    logging.info("home call")
    return {"who are the best ?": "us of course"}
