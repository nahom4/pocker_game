from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.controllers.pocker_controller import router as poker_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(poker_router)