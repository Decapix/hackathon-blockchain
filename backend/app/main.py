from fastapi import FastAPI
from routes import router
import os
import logging
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tu peux restreindre à ["http://localhost:3000"] si tu veux
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
