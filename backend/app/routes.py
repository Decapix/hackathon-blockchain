from fastapi import APIRouter, Query
import logging
from utils_session import *
from web3dev import get_latest_block, compile_solidity_contract, deploy_contract
from __init__ import supabase

router = APIRouter()

@router.get("/")
async def home(n: int = 10):
    """home"""
    logging.error("home call")
    return {"who are the best ?": "us of course"}




@router.get("/items/")
async def read_item(name: str = Query(..., description="The name of the item"),
                    number: int = Query(..., description="The number associated with the item")):
    logging.error("read_item call")
    #
    return {"name": name, "number": number}
