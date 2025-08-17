import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Trophy, DollarSign, Users } from 'lucide-react';

interface GameEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWinner: boolean;
  potAmount: number;
  amountWon?: number;
  winnerInfo?: {
    name: string;
    hand: string;
  };
  onNewGame: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  isOpen,
  onClose,
  isWinner,
  potAmount,
  amountWon = 0,
  winnerInfo,
  onNewGame
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isWinner ? (
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          
          <DialogTitle className={`text-2xl ${isWinner ? 'text-yellow-600' : 'text-gray-600'}`}>
            {isWinner ? 'Congratulations!' : 'Better Luck Next Time'}
          </DialogTitle>
          
          <DialogDescription className="text-lg mt-4">
            {isWinner ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <DollarSign className="w-5 h-5" />
                  <span>You won ${amountWon.toLocaleString()}!</span>
                </div>
                <div className="text-sm text-gray-600">
                  Total pot: ${potAmount.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-gray-600">
                  Sorry, you lost this hand.
                </div>
                <div className="text-sm text-gray-600">
                  Total pot: ${potAmount.toLocaleString()}
                </div>
                {winnerInfo && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm">
                      <strong>Winner:</strong> {winnerInfo.name}
                    </div>
                    <div className="text-sm">
                      <strong>Winning Hand:</strong> {winnerInfo.hand}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Review Hand
          </Button>
          <Button 
            onClick={onNewGame}
            className="flex-1"
          >
            New Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameEndModal;