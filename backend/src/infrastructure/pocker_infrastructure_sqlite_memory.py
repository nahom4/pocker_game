import sqlite3
from typing import List, Optional
from src.models.pocker_models import Hand, HandResponse


class HandInfrastructure:
    def __init__(self):
        """Initialize SQLite in-memory database."""
        self.conn = sqlite3.connect(':memory:')
        self._initialize_database()

    def _initialize_database(self):
        """Create tables in SQLite in-memory database."""
        cursor = self.conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hands (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hand_uuid VARCHAR(36) UNIQUE NOT NULL,
                stack INTEGER NOT NULL,
                dealer INTEGER NOT NULL,
                small_blind_index INTEGER NOT NULL,
                big_blind_index INTEGER NOT NULL
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hand_actions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hand_uuid VARCHAR(36) REFERENCES hands(hand_uuid),
                actions TEXT NOT NULL
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hand_players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_id INTEGER NOT NULL,
                hand_uuid VARCHAR(36) REFERENCES hands(hand_uuid),
                winnings INTEGER,
                hand TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hand_states (
                hand_uuid VARCHAR(36) PRIMARY KEY,
                game_state BLOB
            )
        """)
        
        self.conn.commit()

    def create_hand(self, hand: Hand):
        """Create a new hand in SQLite memory database."""
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT INTO hands (hand_uuid, stack, dealer, small_blind_index, big_blind_index)
            VALUES (?, ?, ?, ?, ?)
            """,
            (hand.hand_uuid, hand.stack, hand.dealer, hand.small_blind_index, hand.big_blind_index)
        )
        self.conn.commit()

    def save_serialized_hand(self, hand_uuid: str, serialized_hand: bytes):
        """Save serialized game state to SQLite memory."""
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT OR REPLACE INTO hand_states (hand_uuid, game_state)
            VALUES (?, ?)
            """,
            (hand_uuid, serialized_hand)
        )
        self.conn.commit()

    def get_serialized_hand(self, hand_uuid: str) -> Optional[bytes]:
        """Retrieve serialized game state from SQLite memory."""
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT game_state FROM hand_states WHERE hand_uuid = ?",
            (hand_uuid,)
        )
        result = cursor.fetchone()
        return result[0] if result else None

    def create_player_hand(self, hand_uuid: str, cards_dealt: List[str]):
        """Create player hand entries in SQLite memory."""
        cursor = self.conn.cursor()
        for i, card in enumerate(cards_dealt):
            cursor.execute(
                """
                INSERT INTO hand_players (hand_uuid, player_id, hand)
                VALUES (?, ?, ?)
                """,
                (hand_uuid, i, card)
            )
        self.conn.commit()

    def create_payoffs(self, hand_uuid: str, payoffs: List[int]):
        """Update player winnings in SQLite memory."""
        cursor = self.conn.cursor()
        for i, payoff in enumerate(payoffs):
            cursor.execute(
                """
                UPDATE hand_players
                SET winnings = ?
                WHERE hand_uuid = ? AND player_id = ?
                """,
                (payoff, hand_uuid, i)
            )
        self.conn.commit()

    def log_action(self, hand_uuid: str, actions: str):
        """Log actions for a hand in SQLite memory."""
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT INTO hand_actions (hand_uuid, actions)
            VALUES (?, ?)
            """,
            (hand_uuid, actions)
        )
        self.conn.commit()

    def get_hand_history(self) -> List[HandResponse]:
        """Retrieve complete hand history from SQLite memory."""
        cursor = self.conn.cursor()
        
        cursor.execute("SELECT * FROM hands ORDER BY id DESC")
        hands = cursor.fetchall()
        
        hand_history = []
        
        for hand in hands:
            hand_uuid = hand[1]  # hand_uuid is at index 1
            
            # Get players' hands
            cursor.execute(
                "SELECT player_id, hand FROM hand_players WHERE hand_uuid = ?",
                (hand_uuid,)
            )
            players = cursor.fetchall()
            players_hand = [player[1] for player in players]
            
            # Get actions
            cursor.execute(
                "SELECT actions FROM hand_actions WHERE hand_uuid = ?",
                (hand_uuid,)
            )
            actions = [action[0] for action in cursor.fetchall()]
            
            # Get winnings
            cursor.execute(
                "SELECT player_id, winnings FROM hand_players WHERE hand_uuid = ?",
                (hand_uuid,)
            )
            payoffs = cursor.fetchall()
            winnings = [payoff[1] or 0 for payoff in payoffs]
            
            # Create HandResponse
            hand_response = HandResponse(
                hand_uuid=hand_uuid,
                stack=hand[2],  # stack is at index 2
                dealer=hand[3],  # dealer is at index 3
                small_blind=hand[4],  # small_blind_index is at index 4
                big_blind=hand[5],  # big_blind_index is at index 5
                small_blind_amount=0,
                big_blind_amount=0,
                players_hand=players_hand,
                actions=actions,
                winnings=winnings
            )
            
            hand_history.append(hand_response)
        
        return hand_history

    def __del__(self):
        """Close the database connection when the object is destroyed."""
        if hasattr(self, 'conn'):
            self.conn.close()
