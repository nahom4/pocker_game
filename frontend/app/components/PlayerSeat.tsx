import React from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import PlayingCard from './PlayingCard';
import { GameState } from '../types/pockerTypes';
import { usePokerStore } from '../store/pockerStore';

interface PlayerSeatProps {
  player: {
    id: number;
    name: string;
    stack: number;
    position: string;
    isHuman: boolean;
    cards: Array<{ suit: string; rank: string }>;
  };
  isCurrentPlayer: boolean;
  isDealer: boolean;
  className?: string;
  gameStates: GameState[];
}

const PlayerSeat: React.FC<PlayerSeatProps> = ({ 
  player, 
  isCurrentPlayer, 
  isDealer, 
  className = "" ,
}) => {
  const {action } = usePokerStore();

  return (
    <div className={`flex items-center space-y-1 ${className}`}>
      <div className="flex space-x-0.5">
        {player.isHuman && player.cards.length > 0 ? (
          // Show actual cards for human player
          player.cards.map((card, index) => (
            <PlayingCard
              key={index}
              suit={card.suit}
              rank={card.rank}
              className="scale-75"
            />
          ))
        ) : player.cards.length > 0 || !player.isHuman ? (
          // Show hidden cards for other players
          <>
            <PlayingCard isHidden className="scale-75" />
            <PlayingCard isHidden className="scale-75" />
          </>
        ) : null}
      </div>
      {/* Player Info Card */}
      <Card className={`mx-2 bg-black/40 border-white/30 transition-all duration-300 ${
        isCurrentPlayer ? 'ring-2 ring-yellow-400 bg-yellow-900/30' : ''
      }`}>
        <CardContent className="p-2 flex flex-col items-center space-y-1 min-w-[120px]">
          {/* Player Name and Dealer Badge */}
          <div className="flex items-center space-x-1 text-xs">
            <Badge 
              variant={player.isHuman ? "default" : "secondary"} 
              className={`text-xs px-2 py-0.5 ${
                player.isHuman ? "bg-blue-600 text-white" : "bg-gray-600 text-white"
              }`}
            >
              {player.name}
            </Badge>
            {isDealer && (
              <Badge variant="outline" className="bg-yellow-600 text-white border-yellow-500 text-xs px-1.5 py-0.5">
                D
              </Badge>
            )}
          </div>
          
          {/* Position Badge */}
          <Badge variant="outline" className="bg-black/60 text-white border-white/40 text-xs px-2 py-0.5">
            {player.position}
          </Badge>
          
          {/* Stack Amount */}
          <div className="text-white text-sm">
            ${player.stack.toLocaleString()}
          </div>
          
          {/* Turn Indicator */}
          {isCurrentPlayer && (
            <div className="text-yellow-400 text-xs animate-pulse">
              ● Turn
            </div>
          )}
        </CardContent>
      </Card>
      
      {isCurrentPlayer && action  && (
      <div className="mt-1">
       <span className="inline-block bg-yellow-600/30 text-yellow-100 text-sm px-3 py-2 rounded-full">
      {action}
       </span>
      </div>
      )}
      
    </div>
  );
};

export default PlayerSeat;