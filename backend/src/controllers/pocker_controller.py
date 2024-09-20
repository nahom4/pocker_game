from fastapi import APIRouter
from typing import List
from src.services.pocker_services import PokerService
from src.repositories.pocker_repository import HandRepository
from src.models.pocker_models import Action, GameState, HandResponse, StartHandRequest

router = APIRouter()

hand_repo = HandRepository()
poker_service = PokerService(hand_repo)

@router.post("/api/v1/hand/start", response_model=HandResponse)
async def start_hand(request: StartHandRequest) -> HandResponse:
    return poker_service.start_hand(request.stack)

@router.post("/api/v1/hand/action", response_model=GameState)
async def take_action(action: Action) -> GameState:
    return poker_service.take_action(action=action)

@router.get("/api/v1/hand/history", response_model=List[HandResponse])
async def get_hand_history() -> List[HandResponse]:
    return poker_service.get_hand_history()
