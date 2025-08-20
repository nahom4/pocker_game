from dataclasses import dataclass, field
from pydantic import BaseModel
from typing import List, Optional


@dataclass
class Hand:
    hand_uuid: str
    stack: int
    dealer: int
    small_blind_index: int
    big_blind_index: int


@dataclass
class HandResponse:
    hand_uuid: str
    stack: int
    dealer: int
    small_blind: int
    big_blind: int
    small_blind_amount: int
    big_blind_amount: int
    players_hand: List[str] = field(default_factory=list)
    actions: List[str] = field(default_factory=list)
    winnings: List[int] = field(default_factory=list)


@dataclass
class HandAction:
    hand_uuid: str
    round: str
    actions: str


@dataclass
class HandPlayer:
    player_id: int
    hand_uuid: str
    winnings: int
    hand: str


class Action(BaseModel):
    hand_uuid: str
    action_type: str
    amount: Optional[int] = None


class StartHandRequest(BaseModel):
    stack: int


@dataclass
class GameState:
    hand_uuid: Optional[str] = None
    action: Optional[Action] = None
    round_changed: bool = False
    round_dealing: List[List] = field(default_factory=list)
    winnings: List[int] = field(default_factory=list)
    players_stacks: List[int] = field(default_factory=list)
    game_ended: bool = False
    current_player: int = 0
    next_player: int = 0
    total_pot_amount: int = 0
    valid_actions: List[bool] = field(default_factory=list)
    final_pot : int = 0
    max_bet_or_raise_amount : int = 0
