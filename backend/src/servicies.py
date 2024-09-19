import io
import uuid
from pokerkit import HandHistory, NoLimitTexasHoldem, Automation
from src.repository import HandRepository
from src.models import GameState, HandResponse, Hand, Action


class PokerService:
    def __init__(self, repo: HandRepository):
        self.repo = repo
        self.current_hand = None
        self.game = None

    def start_hand(self, stack):
        self.big_blind = 40
        self.small_blind = self.big_blind // 2
        self.num_players = 6
        self.starting_stack = stack  # Replace 'stack' with the actual value passed during initialization
        self.round_action = []  
        self.buffer = io.BytesIO()
        self.game = NoLimitTexasHoldem(
        (
            Automation.ANTE_POSTING,
            Automation.BET_COLLECTION,
            Automation.BLIND_OR_STRADDLE_POSTING,
            Automation.HOLE_CARDS_SHOWING_OR_MUCKING,
            Automation.HAND_KILLING,
            Automation.CHIPS_PUSHING,
            Automation.CHIPS_PULLING,
            Automation.HOLE_DEALING
        ),
        True,  # Indicates the game is automated
        0,     # Initial pot size (assuming no ante)
        (0, self.small_blind, self.big_blind),  # (ante, small blind, big blind)
        self.big_blind
    )

        # Create the state based on the initialized game
        self.current_hand = self.game(
            [self.starting_stack] * self.num_players,  # Player stack sizes dynamically from variables
            self.num_players  # Number of players dynamically from variables
        )

        
        cards_dealt = self.get_hole_cards()
        small_blind_index = self.current_hand.bets.index(self.small_blind)
        big_blind_index = (small_blind_index + 1) % self.num_players
        dealer_index = (small_blind_index - 1) % self.num_players
        hand_uuid = str(uuid.uuid4())
        hand = Hand(
            hand_uuid=hand_uuid, stack=self.starting_stack,
            dealer=dealer_index, small_blind_index=small_blind_index, big_blind_index=big_blind_index
        )

        serialized_hand = self.get_serialized_hand()
        self.repo.save_serialized_hand(hand_uuid, serialized_hand)
        self.repo.save_hand(hand)
        self.repo.save_player_hand(hand_uuid, cards_dealt)
        hand_response = HandResponse(
            hand_uuid=hand_uuid, stack=self.starting_stack,
            dealer=dealer_index, small_blind=small_blind_index,
            big_blind=big_blind_index, players_hand=cards_dealt,
            big_blind_amount=self.big_blind, small_blind_amount=self.small_blind
        )
        return hand_response

    def take_action(self, action: Action):
        serialized_hand = self.repo.get_serialized_hand(action.hand_uuid)
        self.deserialize_hand(serialized_hand)

        if not self.current_hand:
            raise Exception("No hand is currently in progress")

        amount = 0
        current_player = self.current_hand.actor_index
        max_bet = max(self.current_hand.bets)
        if action.action_type == 'fold':
            amount = self.current_hand.fold()
        elif action.action_type == 'check':
            amount = self.current_hand.check_or_call().amount
        elif action.action_type == 'call':
            amount = self.current_hand.check_or_call().amount
        elif action.action_type == 'bet':
            amount = self.current_hand.complete_bet_or_raise_to(action.amount).amount
        elif action.action_type == 'raise':
            amount = self.current_hand.complete_bet_or_raise_to(action.amount + max_bet).amount
        elif action.action_type == 'allin':
            player_stack_size = self.current_hand.get_effective_stack(current_player)
            amount = self.current_hand.complete_bet_or_raise_to(player_stack_size)

        action.amount = amount
        game_state = GameState()
        game_over = self.current_hand.street_index is None
        round_over = self.current_hand.turn_index is None
        cards_dealt = ""

        if not game_over and round_over:
            current_round = self.current_hand.street_index
            game_state.round_dealing,cards_dealt = self.change_round()
            cards_dealt =  f" {cards_dealt} "
            game_state.round_changed = True
            self.round_action = []

        if self.current_hand.street_index is None:  
            payoffs = self.current_hand.payoffs
            game_state.game_ended = True
            game_state.winnings = payoffs
            self.repo.save_payoffs(action.hand_uuid, payoffs)

        game_state.action = action
        game_state.current_player = current_player
        game_state.valid_actions = self.get_valid_actions()

        serialized_hand = self.get_serialized_hand()
        encoded_action = self.encode_action(action)
        self.repo.save_round_action(action.hand_uuid, encoded_action + cards_dealt)
        self.repo.save_serialized_hand(action.hand_uuid, serialized_hand)

        return game_state

    def change_round(self):
        round_dealings = []
        while self.current_hand.can_burn_card():
            round_name = self.get_round_name(self.current_hand.street_index)
            self.current_hand.burn_card()
            self.current_hand.deal_board()
            board_cards = self.get_board_cards()
            cards_dealt = None
            if len(board_cards) == 3:
                cards_dealt = ''.join(board_cards)
            else:
                cards_dealt = ''.join(board_cards[-1])
                

        round_dealings.append([round_name,cards_dealt] )                
        return round_dealings,cards_dealt

    def get_valid_actions(self):
        actions = [False] * 6

        betting_has_started = any(self.current_hand.bets)
        check_call = self.current_hand.can_check_or_call()
        bet_raise = self.current_hand.can_complete_bet_or_raise_to()

        actions[0] = self.current_hand.can_fold()
        actions[1] = not betting_has_started and check_call
        actions[2] = betting_has_started and check_call
        actions[3] = not betting_has_started and bet_raise
        actions[4] = betting_has_started and bet_raise
        actions[5] = betting_has_started and bet_raise

        print(actions)
        return actions

    def encode_action(self, action : Action):
        encoding = {
            'fold': 'f', 'check': 'x', 'call': 'c',
            'bet': 'b', 'raise': 'r', 'allin': 'allin'
        }
       
        encoded_action = encoding[action.action_type]
        if action.action_type in ['bet', 'raise']:
            encoded_action += str(action.amount)

        return encoded_action + ':'

    def get_round_name(self, round_index):
        round_names = ['Preflop', 'Flop', 'Turn', 'River']
        if round_index is not None:
            return round_names[round_index]

    def get_hand_history(self):
        return self.repo.get_hand_history()

    def get_hole_cards(self):
        hole_cards = self.current_hand.hole_cards
        return ["".join([card.rank + card.suit for card in cards]) for cards in hole_cards]

    def get_board_cards(self):
        return [card.rank + card.suit for card in self.current_hand.get_board_cards(0)]

    def get_serialized_hand(self):
        buffer = io.BytesIO()
        hh = HandHistory.from_game_state(self.game, self.current_hand)
        hh.dump(buffer)
        return buffer.getvalue()
    
    def deserialize_hand(self, serialized_hand):
        buffer = io.BytesIO(serialized_hand)
        hh = HandHistory.load(buffer)
        
        self.current_hand = hh.create_state()
        
        for self.current_hand in hh:
            pass
   
        #apply automatons
        self.current_hand.automations = (
            Automation.ANTE_POSTING,
            Automation.BET_COLLECTION,
            Automation.BLIND_OR_STRADDLE_POSTING,
            Automation.HOLE_CARDS_SHOWING_OR_MUCKING,
            Automation.HAND_KILLING,
            Automation.CHIPS_PUSHING,
            Automation.CHIPS_PULLING,
            Automation.HOLE_DEALING
        )

        