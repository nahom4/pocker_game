import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { History } from "lucide-react";
import PlayerSeat from "./PlayerSeat";
import ActionControls from "./ActionControls";
import GameEndModal from "./GameEndModal";
import { ImageWithFallback } from "./ImageWithFallback";
import PlayingCard from "./PlayingCard";
import { motion, AnimatePresence } from "framer-motion";
import { Action, Card, GameState, Hand, WinnerInfo } from "../types/pockerTypes";
interface PokerTableProps {
  hand: Hand;
  gameStates: GameState[];
  onAction: (action: Action) => void;
  isHumanTurn: boolean;
  newGameStarted: boolean;
  onShowHistory: () => void;
  stack: number;
  onStackChange: (value: number) => void;
  onStartNewHand: () => void;
  gameEnded: boolean;
  winner: boolean;
  setGameEnded: (ended: boolean) => void;
  humanPlayerPosition: number;
  currentPlayerId: number;
  pot: number;
  communityCard: Card[];
  amountWon: number;
  winnerInfo: WinnerInfo;
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
  currentPlayerId,
  pot,
  communityCard,
  amountWon,
  winnerInfo,
}) => {
  const [inputValue, setInputValue] = useState(stack.toString());

  const players = hand?.players || [];
  const humanPlayer = players.find((p) => p.isHuman);
  const dealerPosition = hand?.dealer;

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
          <h1 className="text-white text-lg font-semibold">
            6-Max Texas Holdem
          </h1>
          <Badge variant="secondary" className="bg-black/50 text-white">
            Stack: ${stack.toLocaleString()}
          </Badge>
        </div>

        <div className="flex justify-end">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-20 h-9 text-center border border-gray-200 rounded focus:border-primary focus:ring-0"
              placeholder="Stack"
            />
            <Button
              onClick={handleApplyStack}
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white hover:bg-gray-50 border-gray-200"
            >
              Set
            </Button>
            <Button
              onClick={onShowHistory}
              variant="outline"
              size="sm"
              className="h-9 px-3 bg-white hover:bg-gray-50 border-gray-200 flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              History
            </Button>
            <Button
              onClick={onStartNewHand}
              size="sm"
              className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {newGameStarted ? "Reset" : "Start"}
            </Button>
          </div>
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
                isCurrentPlayer={currentPlayerId === 3}
                isDealer={dealerPosition === players[3].id}
                className="row-start-1 col-start-1"
                gameStates={gameStates}
                gameEnded={gameEnded}
              />
            )}
            {players[4] && (
              <PlayerSeat
                player={players[4]}
                isCurrentPlayer={currentPlayerId === 4}
                isDealer={dealerPosition === players[4].id}
                className="row-start-1 col-start-2"
                gameStates={gameStates}
                gameEnded={gameEnded}
              />
            )}
            {players[5] && (
              <PlayerSeat
                player={players[5]}
                isCurrentPlayer={currentPlayerId === 5}
                isDealer={dealerPosition === players[5].id}
                className="row-start-1 col-start-3"
                gameStates={gameStates}
                gameEnded={gameEnded}
              />
            )}

            {/* Side players */}
            {players[2] && (
              <PlayerSeat
                player={players[2]}
                isCurrentPlayer={currentPlayerId === 2}
                isDealer={dealerPosition === players[2].id}
                className="row-start-2 col-start-1"
                gameStates={gameStates}
                gameEnded={gameEnded}
              />
            )}
            {players[0] && (
              <PlayerSeat
                player={players[0]}
                isCurrentPlayer={currentPlayerId === 0}
                isDealer={dealerPosition === players[0].id}
                className="row-start-2 col-start-3"
                gameStates={gameStates}
                gameEnded={gameEnded}
              />
            )}

            {/* Bottom player */}
            {players[1] && (
              <PlayerSeat
                player={players[1]}
                isCurrentPlayer={currentPlayerId === 1}
                isDealer={dealerPosition === players[1].id}
                className="row-start-3 col-start-1"
                gameStates={gameStates}
                gameEnded={gameEnded}
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
                  <AnimatePresence>
                    {communityCard.map((card, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.8 }}
                        transition={{ duration: 0.4, delay: index * 0.15 }}
                      >
                        <PlayingCard
                          suit={card?.suit}
                          rank={card?.rank}
                          className="scale-110"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="bg-green-700 text-white"
                  >
                    Pot: ${(pot || 0).toLocaleString()}
                  </Badge>
                </div>
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
        potAmount={pot || 0}
        amountWon={amountWon}
        winnerInfo={winnerInfo}
        onNewGame={handleNewGameFromModal}
      />
    </div>
  );
};

export default PokerTable;
