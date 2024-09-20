import React from 'react';
import { GameState } from '../types/pockerTypes'; // Adjust the import path as needed

interface HandLogProps {
  gameStates: GameState[];
  newGameStarted: boolean;
}

const HandLog: React.FC<HandLogProps> = ({ gameStates, newGameStarted }) => {
 
  const gameState = gameStates[gameStates.length - 1];

  if (gameStates.length === 0 || !newGameStarted) {
    return null;
  }

  return (
    <>
        <div className="hand-log p-4 rounded-lg shadow-md text-sm text-gray-700" data-testid="hand-log">
      {gameStates.map((gameState, index) => (
        <div key={index} className="hand-log-item" data-testid={`hand-log-item-${index}`}>
          <p className="bg-white rounded-lg shadow-sm mb-4 p-2" data-testid={`action-${index}`}>
            <strong>Player {gameState.current_player}:</strong> {gameState.action.action_type}
            {gameState.action.action_type === 'bet' && ` ${gameState.action.amount} chips`}
            {gameState.action.action_type === 'raise' && ` to ${gameState.action.amount} chips`}
          </p>

          {gameState.round_changed && (
            <p className="text-yellow-400 text-lg" data-testid={`round-change-${index}`}>
              {gameState.round_dealing.map((deal, i) => (
                <span key={i}>
                  <strong>{deal[0]}</strong> cards dealt: {deal[1]}{' '}<br></br>
                </span>
              ))}
            </p>
          )}
        </div>
      ))}

      {gameState && gameState.game_ended  && (
        <p className="text-green-600 text-lg" data-testid="game-ended">
          <strong>Hand: #{gameState.action.hand_uuid} has ended.</strong><br></br>
          <strong>Final Pot was {gameState.final_pot} dollars.</strong> 
        </p>
      )}
    </div>
    </>
    
  );
};

export default HandLog;
