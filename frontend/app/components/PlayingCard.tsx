import React from 'react';

interface PlayingCardProps {
  suit?: string;
  rank?: string;
  isHidden?: boolean;
  className?: string;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ 
  suit, 
  rank, 
  isHidden = false, 
  className = "" 
}) => {
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'h': return '♥️';
      case 'd': return '♦️';
      case 'c': return '♣️';
      case 's': return '♠️';
      default: return '';
    }
  };

  const getSuitColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
  };

  if (isHidden) {
    return (
      <div className={`w-12 h-16 bg-blue-900 border border-gray-300 rounded-lg flex items-center justify-center shadow-md ${className}`}>
        <div className="w-8 h-12 bg-blue-800 rounded border border-blue-700 flex items-center justify-center">
          <div className="w-6 h-8 border-2 border-blue-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (!suit || !rank) {
    return (
      <div className={`w-12 h-16 bg-gray-200 border border-gray-300 rounded-lg shadow-md ${className}`}>
      </div>
    );
  }

  return (
    <div className={`w-12 h-16 bg-white border border-gray-300 rounded-lg shadow-md flex flex-col justify-between p-1 ${className}`}>
      <div className={`flex flex-col items-center ${getSuitColor(suit)}`}>
        <span className="text-xs font-bold leading-none">{rank}</span>
        <span className="text-sm leading-none">{getSuitSymbol(suit)}</span>
      </div>
      <div className={`flex flex-col items-center rotate-180 ${getSuitColor(suit)}`}>
        <span className="text-xs font-bold leading-none">{rank}</span>
        <span className="text-sm leading-none">{getSuitSymbol(suit)}</span>
      </div>
    </div>
  );
};

export default PlayingCard;