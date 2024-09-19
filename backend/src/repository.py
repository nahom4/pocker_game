from src.infrastructure import HandInfrastructure
from src.models import Hand

class HandRepository:
    def __init__(self) -> None:
        self.hand_infrastructure = HandInfrastructure()

    def save_hand(self, hand: Hand):
        self.hand_infrastructure.create_hand(hand)

    def save_player_hand(self, hand_uuid, cards_dealt):
        self.hand_infrastructure.create_player_hand(hand_uuid, cards_dealt)

    def save_payoffs(self, hand_uuid, payoffs):
        self.hand_infrastructure.create_payoffs(hand_uuid, payoffs)

    def save_round_action(self, hand_uuid, actions):
        self.hand_infrastructure.log_action(hand_uuid, actions)

    def save_serialized_hand(self,hand_uuid, serialized_hand):
        self.hand_infrastructure.save_serialized_hand(hand_uuid, serialized_hand)
    def get_hand_history(self):
        return self.hand_infrastructure.get_hand_history()
    def get_serialized_hand(self,hand_uuid):
        return self.hand_infrastructure.get_serialized_hand(hand_uuid)
    
