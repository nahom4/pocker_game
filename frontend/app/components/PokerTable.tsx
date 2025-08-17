import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { History } from "lucide-react";
import PlayingCard from "./PlayingCard";
import PlayerSeat from "./PlayerSeat";
import ActionControls from "./ActionControls";
import GameEndModal from "./GameEndModal";
import { ImageWithFallback } from "./ImageWithFallback";

interface PokerTableProps {
  hand: any;
  gameStates: any[];
  onAction: (action: any) => void;
  isHumanTurn: boolean;
  newGameStarted: boolean;
  onShowHistory: () => void;
  stack: number;
  onStackChange: (value: number) => void;
  onStartNewHand: () => void;
  gameEnded: boolean;
  winner: boolean | null;
  setGameEnded: (ended: boolean) => void;
  humanPlayerPosition: number;
  currentPlayerId: number
}

const PokerTable: React.FC<PokerTableProps> = ({
  hand,
  gameStates,
  onAction,
  isHumanTurn,
  newGameStarted,
  onShowHistory,
  stack,
  onStackChange,
  onStartNewHand,
  gameEnded,
  winner,
  setGameEnded,
  humanPlayerPosition,
  currentPlayerId
}) => {
  const [inputValue, setInputValue] = useState(stack.toString());

  const players = hand?.players || [];
  const humanPlayer = players.find((p) => p.isHuman);
  const communityCards = hand?.community_cards || [];
  const dealerPosition = hand?.dealer_position;

  const handleApplyStack = () => {
    const value = Number(inputValue);
    if (!isNaN(value) && value > 0) {
      onStackChange(value);
    }
  };

  const handleGameEndClose = () => {
    setGameEnded(false);
  };

  const handleNewGameFromModal = () => {
    setGameEnded(false);
    onStartNewHand();
  };

  useEffect(() => {
    setInputValue(stack.toString());
  }, [stack]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1567136445648-01b1b12734ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Casino Table"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Top Controls */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-white">6-Max Texas Holdem</h1>
          <Badge variant="secondary" className="bg-black/50 text-white">
            Stack: ${stack.toLocaleString()}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-24 px-2 py-1 rounded border bg-white/90"
              placeholder="Stack"
            />
            <Button onClick={handleApplyStack} size="sm" variant="secondary">
              Set
            </Button>
          </div>

          <Button onClick={onShowHistory} variant="outline" size="sm">
            <History className="w-4 h-4 mr-1" />
            History
          </Button>

          <Button onClick={onStartNewHand} variant="outline" size="sm">
            {newGameStarted ? "Restart" : "Start"}
          </Button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl h-full flex flex-col">
          {/* Table Grid Layout */}
          <div className="flex-1 grid grid-cols-3 grid-rows-3 place-items-center min-h-[600px] gap-6">
            {/* Top row players */}
            {players[3] && (
              <PlayerSeat
                player={players[3]}
                currentPlayerId={currentPlayerId === 3}
                isDealer={dealerPosition === players[3].id}
                className="row-start-1 col-start-1"
              />
            )}
            {players[4] && (
              <PlayerSeat
                player={players[4]}
                isCurrentPlayer={currentPlayerId === 4}
                isDealer={dealerPosition === players[4].id}
                className="row-start-1 col-start-2"
              />
            )}
            {players[5] && (
              <PlayerSeat
                player={players[5]}
                isCurrentPlayer={currentPlayerId === 5}
                isDealer={dealerPosition === players[5].id}
                className="row-start-1 col-start-3"
              />
            )}

            {/* Side players */}
            {players[2] && (
              <PlayerSeat
                player={players[2]}
                isCurrentPlayer={currentPlayerId === 2}
                isDealer={dealerPosition === players[2].id}
                className="row-start-2 col-start-1"
              />
            )}
            {players[0] && (
              <PlayerSeat
                player={players[0]}
                isCurrentPlayer={currentPlayerId === 0}
                isDealer={dealerPosition === players[0].id}
                className="row-start-2 col-start-3"
              />
            )}

            {/* Bottom player */}
            {players[1] && (
              <PlayerSeat
                player={players[1]}
                isCurrentPlayer={currentPlayerId === 3}
                isDealer={dealerPosition === players[1].id}
                className="row-start-3 col-start-1"
              />
            )}

            {/* Community Cards Center */}
            <div className="row-start-2 col-start-2 flex flex-col items-center">
              <div className="bg-black/30 rounded-2xl p-6 border-2 border-yellow-600/30 min-w-80">
                <div className="text-center mb-4">
                  <Badge
                    variant="outline"
                    className="bg-yellow-600 text-white border-yellow-500"
                  >
                    Community Cards
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <PlayingCard
                      key={index}
                      suit={communityCards[index]?.suit}
                      rank={communityCards[index]?.rank}
                      className="scale-110"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="bg-green-700 text-white"
                  >
                    Pot: ${(hand?.pot || 0).toLocaleString()}
                  </Badge>
                </div>
                {hand?.round && (
                  <div className="text-center mt-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-600 text-white border-blue-500 text-sm"
                    >
                      {hand.round.charAt(0).toUpperCase() +
                        hand.round.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            {/* Bottom Action Area */}
            {newGameStarted &&
              humanPlayer &&
              currentPlayerId === humanPlayer.id && (
                <div className="pb-4 row-start-3 col-start-2">
                  <div className="bg-black/20 rounded-lg p-4 border border-white/20 max-w-2xl mx-auto">
                    <ActionControls
                      onAction={onAction}
                      gameStates={gameStates}
                      hand={hand}
                      newGameStarted={newGameStarted}
                      isHumanTurn={isHumanTurn}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
        </div>



      <GameEndModal
        isOpen={gameEnded}
        onClose={handleGameEndClose}
        isWinner={winner}
        potAmount={hand?.pot || 0}
        amountWon={winner ? (hand?.pot || 0) / 2 : 0}
        winnerInfo={
          !winner ? { name: "Opponent", hand: "Pair of Aces" } : undefined
        }
        onNewGame={handleNewGameFromModal}
      />
    </div>
  );
};

export default PokerTable;
