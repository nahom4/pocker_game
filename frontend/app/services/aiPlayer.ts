// AI decision making for poker players
import { Action, GameState } from "../types/pockerTypes";

export class AIPlayer {
  private playerPosition: number;

  constructor(playerPosition: number) {
    this.playerPosition = playerPosition;
  }

  // Simple AI decision making based on game state
  makeDecision(gameState: GameState): Action {
    const validActions = gameState.valid_actions;
    const handUuid = gameState.action.hand_uuid;
    // debugger 
    // Simple strategy: 
    // - Fold if no good hand (simplified)
    // - Call/check if possible
    // - Bet/raise occasionally
    
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
      return { hand_uuid: handUuid, action_type: "call" };
    }
    
    // Bet (action 3)
    if (validActions[3]) {
      const betAmount = Math.min(
        Math.floor(Math.random() * 100) + 40,
        gameState.max_bet_or_raise_amount
      );
      return { hand_uuid: handUuid, action_type: "bet", amount: betAmount };
    }
    
    // Raise (action 4)
    if (validActions[4]) {
      const raiseAmount = Math.min(
        Math.floor(Math.random() * 100) + 40,
        gameState.max_bet_or_raise_amount
      );
      return { hand_uuid: handUuid, action_type: "raise", amount: raiseAmount };
    }
    
    // All-in (action 5)
    if (validActions[5] && random > 0.8) {
      return { hand_uuid: handUuid, action_type: "allin" };
    }
    
    // Default to check/fold
    return { hand_uuid: handUuid, action_type: validActions[1] ? "check" : "fold" };
  }
}
