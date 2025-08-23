/* eslint-disable @typescript-eslint/no-explicit-any */
// AI decision making for poker players
import { Action, GameState } from "../types/pockerTypes";

export class AIPlayer {

  private playerPosition: number;
  amount : number
  setAmount : any
  constructor(playerPosition: number, amount : number, setAmount : any) {
    this.playerPosition = playerPosition;
    this.amount = amount;
    this.setAmount = setAmount
  }
  
  // Simple AI decision making based on game state
  makeDecision(gameState: GameState): Action {
    const validActions = gameState.valid_actions;
    const handUuid = gameState.action.hand_uuid;
  
    const random = Math.random();
    
    // Fold (action 0)
    if (validActions[0] && random < 0.2) {
      return { hand_uuid: handUuid, action_type: "fold" };
    }
    
    // Check (action 1)
    if (validActions[1]) {
      return { hand_uuid: handUuid, action_type: "check" };
    }
    
    // Call (action 2)
    if (validActions[2]) {
      return { hand_uuid: handUuid, action_type: "call",amount : this.amount };
    }
    
    // Bet (action 3)
    if (validActions[3]) {
      const betAmount = Math.min(
        Math.floor(Math.random() * 100) + 40,
        gameState.max_bet_or_raise_amount
      );
      this.setAmount(betAmount)
      return { hand_uuid: handUuid, action_type: "bet", amount: betAmount };
    }
    
    // Raise (action 4)
    if (validActions[4]) {
      const raiseAmount = Math.min(
        Math.floor(Math.random() * 100) + 40,
        gameState.max_bet_or_raise_amount
      );
      this.setAmount(raiseAmount)
      return { hand_uuid: handUuid, action_type: "raise", amount: raiseAmount };
    }
    
    // All-in (action 5)
    if (validActions[5] && random > 0.8) {
      const allInAmount = gameState.max_bet_or_raise_amount;
      this.setAmount(allInAmount)
      return { hand_uuid: handUuid, action_type: "allin" };
    }
    
    // Default to check/fold
    return { hand_uuid: handUuid, action_type: validActions[1] ? "check" : "fold" };
  }
}
