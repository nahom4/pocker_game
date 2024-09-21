import psycopg2
from psycopg2 import sql
import configparser
from src.models.pocker_models import Hand, HandResponse

config = configparser.ConfigParser(interpolation=None)
config.read('config.ini')

connection_params = {
    'dbname': config['database']['dbname'],
    'user': config['database']['user'],
    'password': config['database']['password'],
    'host': config['database']['host'],
    'port': config['database']['port']
}


class HandInfrastructure:
    def __init__(self):
        self.connection_params = connection_params
        self._initialize_database()

    def _connect(self):
        return psycopg2.connect(**self.connection_params)

    def _initialize_database(self):
        with self._connect() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS hands (
                        id SERIAL PRIMARY KEY,
                        hand_uuid VARCHAR(36) UNIQUE NOT NULL,
                        stack INTEGER NOT NULL,
                        dealer INTEGER NOT NULL,
                        small_blind_index INTEGER NOT NULL,
                        big_blind_index INTEGER NOT NULL
                    )
                """)
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS hand_actions (
                        id SERIAL PRIMARY KEY,
                        hand_uuid VARCHAR(36) REFERENCES hands(hand_uuid),
                        actions TEXT NOT NULL
                    )
                """)
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS hand_players (
                        id SERIAL PRIMARY KEY,
                        player_id INTEGER NOT NULL,
                        hand_uuid VARCHAR(36) REFERENCES hands(hand_uuid),
                        winnings INTEGER,
                        hand TEXT
                    )
                """)

                cur.execute("""
                        CREATE TABLE IF NOT EXISTS hand_states (
                            hand_uuid UUID PRIMARY KEY,
                            game_state BYTEA
                        )""")

    def create_hand(self, hand):
        with self._connect() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        INSERT INTO hands (hand_uuid, stack, dealer, small_blind_index, big_blind_index)
                        VALUES (%s, %s, %s, %s, %s)
                    """),
                    (hand.hand_uuid, hand.stack, hand.dealer, hand.small_blind_index, hand.big_blind_index)
                )

    def save_serialized_hand(self,hand_uuid, serialized_hand):
         with self._connect() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        INSERT INTO hand_states (hand_uuid, game_state)
                        VALUES (%s, %s)
                        ON CONFLICT (hand_uuid) DO UPDATE SET game_state = EXCLUDED.game_state
                    """),
                    (hand_uuid, psycopg2.Binary(serialized_hand))
                )

    def get_serialized_hand(self, hand_uuid):
        with self._connect() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("SELECT game_state FROM hand_states WHERE hand_uuid = %s"),
                    (hand_uuid,)
                )
                serialized_hand = cur.fetchone()
                return serialized_hand[0]
            
    def create_player_hand(self, hand_uuid, cards_dealt):
        with self._connect() as conn:
            with conn.cursor() as cur:
                for i, card in enumerate(cards_dealt):
                    cur.execute(
                        sql.SQL("""
                            INSERT INTO hand_players (hand_uuid, player_id, hand)
                            VALUES (%s, %s, %s)
                        """),
                        (hand_uuid, i, card)
                    )

    def create_payoffs(self, hand_uuid, payoffs):
        with self._connect() as conn:
            with conn.cursor() as cur:
                for i, payoff in enumerate(payoffs):
                    cur.execute(
                        sql.SQL("""
                            UPDATE hand_players
                            SET winnings = %s
                            WHERE hand_uuid = %s AND player_id = %s
                        """),
                        (payoff, hand_uuid, i)
                    )

    def log_action(self, hand_uuid, actions):
        with self._connect() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        INSERT INTO hand_actions (hand_uuid, actions)
                        VALUES (%s, %s)
                    """),
                    (hand_uuid, actions)
                )

    def get_hand_history(self):
        with self._connect() as conn:
            with conn.cursor() as cur:
                cur.execute(sql.SQL("SELECT * FROM hands ORDER BY id DESC"))
                hands = cur.fetchall()

                hand_history = []

                for hand in hands:
                    hand = hand[1:]
                    hand = Hand(
                        hand_uuid=hand[0],
                        stack=hand[1],
                        dealer=hand[2],
                        small_blind_index=hand[3],
                        big_blind_index=hand[4]
                    )

                    hand_uuid = hand.hand_uuid

                    cur.execute(
                        sql.SQL("SELECT player_id, hand FROM hand_players WHERE hand_uuid = %s"),
                        (hand_uuid,)
                    )
                    players = list(cur.fetchall())
                    players = list(map(lambda x: x[1], players))

                    cur.execute(
                        sql.SQL("SELECT actions FROM hand_actions WHERE hand_uuid = %s"),
                        (hand_uuid,)
                    )
                    actions = list(map(lambda x: x[0], list(cur.fetchall())))

                    cur.execute(
                        sql.SQL("SELECT player_id, winnings FROM hand_players WHERE hand_uuid = %s"),
                        (hand_uuid,)
                    )
                    payoffs = list(cur.fetchall())
                    payoffs = list(map(lambda x: x[1], payoffs))

                    hand_response = HandResponse(
                        hand_uuid=hand_uuid,
                        stack=hand.stack,
                        dealer=hand.dealer,
                        small_blind=hand.small_blind_index,
                        big_blind=hand.big_blind_index,
                        small_blind_amount=0,
                        big_blind_amount=0,
                        players_hand=players,
                        actions=actions,
                        winnings=payoffs,
                    )

                    hand_history.append(hand_response)

                return hand_history
