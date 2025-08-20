export interface Action {
    hand_uuid : string
    action_type: string
    amount?: number;
   
  }
  
  export interface GameState {
    hand_uuid : string;
    action : Action,
    round: string;
    round_changed: boolean;
    round_dealing: [string, string][];
    winnings : Array<number>;
    game_ended : boolean;
    current_player : number;
    next_player : number;
    valid_actions: Array<boolean>;
    final_pot : number;
    max_bet_or_raise_amount : number;
    total_pot_amount : number;
    players_stacks : number[]
  }
 
 
   
 export interface Hand{
    hand_uuid : string;
    stack : number;
    dealer : number;
    small_blind : number;
    big_blind : number;
    small_blind_amount : number;
    big_blind_amount : number;
    players_hand : string[];
    actions : string[];
    winnings : number[];
    players : Player[];
   
}


export interface Player {
  id: number;
  name: string;
  stack: number;
  position: string;
  isHuman: boolean;
  cards: Array<{ suit: string; rank: string }>;
  isActive: boolean
};


export interface StartHandRequest{
  stack : number;
}