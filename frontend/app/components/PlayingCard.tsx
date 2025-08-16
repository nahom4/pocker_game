import React from 'react';

interface PlayingCardProps {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  faceDown?: boolean;
  className?: string;
}

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

const suitColors = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-gray-900',
  spades: 'text-gray-900'
};

export const PlayingCard: React.FC<PlayingCardProps> = ({
  suit,
  rank,
  faceDown = false,
  className = ''
}) => {
  if (faceDown) {
    return (
      <div className={`w-16 h-24 bg-blue-600 rounded-lg border-2 border-gray-400 shadow-lg flex items-center justify-center ${className}`}>
        <div className="w-12 h-20 bg-blue-800 rounded-md flex items-center justify-center">
          <div className="w-8 h-16 bg-blue-900 rounded-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-16 h-24 bg-white rounded-lg border-2 border-gray-400 shadow-lg p-1 ${className}`}>
      <div className="flex flex-col items-center justify-between h-full">
        <div className={`text-lg font-bold ${suitColors[suit]}`}>
          {rank}
        </div>
        <div className={`text-2xl ${suitColors[suit]}`}>
          {suitSymbols[suit]}
        </div>
        <div className={`text-lg font-bold ${suitColors[suit]} transform rotate-180`}>
          {rank}
        </div>
      </div>
    </div>
  );
};

export default PlayingCard;
