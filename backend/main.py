from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.servicies import PokerService
from src.repository import HandRepository
from src.models import Action, GameState, HandResponse,StartHandRequest

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

hand_repo = HandRepository()
poker_service = PokerService(hand_repo)


@app.post("/api/v1/hand/start")
async def start_hand(request: StartHandRequest) -> HandResponse:
    return poker_service.start_hand(request.stack)


@app.post("/api/v1/hand/action")
async def take_action(action: Action) -> GameState:
    return poker_service.take_action(action=action)


@app.get("/api/v1/hand/history")
async def get_hand_history() -> List[HandResponse]:
    return poker_service.get_hand_history()
