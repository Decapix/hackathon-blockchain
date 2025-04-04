
from fastapi import FastAPI
from routes import router
import os
import logging

app = FastAPI()

app.include_router(router)
