import React, { useEffect } from 'react';
import { Hand, GameState } from '../types/pockerTypes';

interface HandHistoryProps {
  history: Hand[];
  gameStates: GameState[];
  fetchHandHistory: () => Promise<void>;
}

const handleFetchHandHistory = async (fetchHandHistory: () => Promise<void>) => {
  try {
    await fetchHandHistory();
  } catch (error) {
    console.error("Failed to start a new hand:", error);
  }
};

const HandHistory: React.FC<HandHistoryProps> = ({ history, gameStates, fetchHandHistory }) => {
  const currentGameState = gameStates[gameStates.length - 1];
  console.log(history, "history in the component");
  
  useEffect(() => {
    if (currentGameState && currentGameState.game_ended) {
      handleFetchHandHistory(fetchHandHistory);
    }
  }, [currentGameState, fetchHandHistory]);

  return (
    <div className="hand-history p-4 bg-gray-100 rounded-lg shadow-md" data-testid="hand-history">
      <h1 className="text-2xl font-bold mb-4" data-testid="hand-history-title">Hand History</h1>
      {history.map((hand, index) => (
        <div key={index} className="hand-history-item mb-4 p-4 bg-white rounded-lg shadow-sm" data-testid={`hand-history-item-${index}`}>
          {/* Display the hand ID */}
          <p className="text-lg font-semibold" data-testid={`hand-id-${index}`}>
            <strong>Hand:</strong> #{hand.hand_uuid}
          </p>

          {/* Display stack size and dealer/blinds information */}
          <p className="text-sm text-gray-700" data-testid={`hand-info-${index}`}>
            <strong>Stack:</strong> {hand.stack} | <strong>Dealer:</strong> Player {hand.dealer} | 
            <strong> Small Blind:</strong> Player {hand.small_blind} ({hand.small_blind_amount} chips) | 
            <strong> Big Blind:</strong> Player {hand.big_blind} ({hand.big_blind_amount} chips)
          </p>

          {/* Display players' hands */}
          <p className="text-sm text-gray-700" data-testid={`players-hand-${index}`}>
            <strong>Hands:</strong> {hand.players_hand.map((playerHand: string, i) => (
              `Player ${i + 1}: ${playerHand}`
            )).join(', ')}
          </p>

          {/* Display Actions */}
          <p className="text-sm text-gray-700" data-testid={`actions-${index}`}>
            <strong>Actions:</strong> {hand.actions.map((action: string) => (
              `${action}`
            )).join('')}
          </p>

          {/* Display Winnings */}
          <p className="text-sm text-gray-700" data-testid={`winnings-${index}`}>
            <strong>Winnings:</strong> {hand.winnings.map((winning: number, i) => (
              `Player ${i + 1}: ${winning}`
            )).join(', ')}
          </p>

        </div>
      ))}
    </div>
  );
};

export default HandHistory;
