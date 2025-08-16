import React from 'react';
import { PlayingCard } from './PlayingCard';
import { CardHand } from './CardHand';
import { PlayerSeat } from './PlayerSeat';
import { CommunityCards } from './CommunityCards';
import { ChipStack } from './ChipStack';
import { GameState, Hand } from '../types/pockerTypes';

interface CasinoTableProps {
  hand: Hand;
  gameStates: GameState[];
  isHumanTurn: boolean;
}

export const CasinoTable: React.FC<CasinoTableProps> = ({
  hand,
  gameStates,
  isHumanTurn
}) => {
  const currentGameState = gameStates[gameStates.length - 1];
  const communityCards = currentGameState?.round_dealing?.map(([card, _]) => card) || [];
  
  // Player positions around the table
  const playerPositions = [
    { position: 0, x: '50%', y: '85%' },    // Bottom (Human)
    { position: 1, x: '20%', y: '70%' },    // Bottom-left
    { position: 2, x: '15%', y: '40%' },    // Left
    { position: 3, x: '20%', y: '15%' },    // Top-left
    { position: 4, x: '50%', y: '10%' },    // Top (Dealer)
    { position: 5, x: '80%', y: '15%' },    // Top-right
  ];

  return (
    <div className="relative w-full h-full bg-green-800 rounded-full shadow-2xl overflow-hidden">
      {/* Table felt texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      {/* Table rail */}
      <div className="absolute inset-2 border-8 border-yellow-700 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800"></div>

      {/* Community cards area */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <CommunityCards cards={communityCards} />
      </div>

      {/* Pot display */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg">
          <span className="text-lg font-bold">Pot: ${currentGameState?.final_pot || 0}</span>
        </div>
      </div>

      {/* Player seats */}
      {playerPositions.map(({ position, x, y }) => (
        <div
          key={position}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: x, top: y }}
        >
          <PlayerSeat
            playerNumber={position + 1}
            isHuman={position === 0}
            isDealer={hand.dealer === position}
            isSmallBlind={hand.small_blind === position}
            isBigBlind={hand.big_blind === position}
            stack={hand.winnings[position] || 1000}
            hand={position < hand.players_hand.length ? hand.players_hand[position] : ''}
            isActive={currentGameState?.current_player === position}
            isTurn={isHumanTurn && position === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default CasinoTable;
