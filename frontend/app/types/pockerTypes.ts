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
    round_dealing: [string, number][];
    winnings : Array<number>;
    game_ended : boolean;
    current_player : number;
    valid_actions: Array<boolean>;
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
   
}

export interface StartHandRequest{
  stack : number;
}