import {useRef} from "react";
import { Action, GameState, Hand } from "../types/pockerTypes";
import { Button } from "@/components/ui/button";
import { usePokerStore } from "../store/pockerStore";

interface ActionControlsProps {
  onAction: (action: Action) => void;
  gameStates: GameState[];
  hand: Hand;
  newGameStarted: boolean;
  isHumanTurn: boolean;
}

const ActionControls: React.FC<ActionControlsProps> = ({
  onAction,
  gameStates,
  hand,
  newGameStarted,
  isHumanTurn,
}) => {
  // const [amount, setAmount] = useState(40);
  const {amount, setAmount} = usePokerStore()
  const maxBetOrRaiseAmountRef = useRef(hand.stack);
  maxBetOrRaiseAmountRef.current = hand.stack - hand.big_blind_amount;

  const handleDecreaseBet = () => {
    setAmount(Math.max(amount - 40, 40));
  };

  const handleIncreaseBet = () => {
    setAmount( Math.min(amount + 40, maxBetOrRaiseAmountRef.current)
    );
  };

  let validActions = [true, false, true, false, true, true];

  if (gameStates.length > 0) {
    const gameState = gameStates[gameStates.length - 1];
    validActions = gameState.valid_actions;
    maxBetOrRaiseAmountRef.current = gameState.max_bet_or_raise_amount;
  }


  const handleActionClick = (action_type: string) => {
    const hand_uuid = hand.hand_uuid;
    const action: Action = { hand_uuid, action_type, amount };
    onAction(action);
  };

  if (!newGameStarted || !isHumanTurn) {
    return null;
  }

  return (
    <div
      className="action-controls flex justify-between flex-wrap gap-2"
      data-testid="action-controls"
    >
      {/* Fold */}
      {validActions[0] && (
        <Button
          onClick={() => handleActionClick("fold")}
          data-testid="fold-button"
        >
          Fold
        </Button>
      )}

      {/* Check */}
      {validActions[1] && (
        <Button
          onClick={() => handleActionClick("check")}
          data-testid="check-button"
        >
          Check
        </Button>
      )}

      {/* Call */}
      {validActions[2] && (
        <Button
          onClick={() => handleActionClick("call")}
          data-testid="call-button"
        >
          Call
        </Button>
      )}

      {/* Bet (includes amount control) */}
      {validActions[3] && (
        <div className="flex gap-2" data-testid="bet-controls">
          <Button onClick={handleDecreaseBet} data-testid="decrease-bet">
            -
          </Button>
          <Button
            onClick={() => handleActionClick("bet")}
            data-testid="bet-button"
          >
            Bet {amount}
          </Button>
          <Button onClick={handleIncreaseBet} data-testid="increase-bet">
            +
          </Button>
        </div>
      )}

      {/* Raise (includes amount control) */}
      {validActions[4] && (
        <div className="flex gap-2" data-testid="raise-controls">
          <Button onClick={handleDecreaseBet} data-testid="decrease-raise">
            -
          </Button>
          <Button
            onClick={() => handleActionClick("raise")}
            data-testid="raise-button"
          >
            Raise {amount}
          </Button>
          <Button onClick={handleIncreaseBet} data-testid="increase-raise">
            +
          </Button>
        </div>
      )}

      {/* All-in */}
      {validActions[5] && (
        <Button
          onClick={() => handleActionClick("allin")}
          data-testid="allin-button"
        >
          All-in
        </Button>
      )}
    </div>
  );
};

export default ActionControls;
