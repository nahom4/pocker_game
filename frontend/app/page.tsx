"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePokerStore } from "@/app/store/pockerStore";
import { StartHandRequest } from "./types/pockerTypes";
import HandHistoryPanel from "./components/HandHistoryPanel";
import PokerTable from "./components/PokerTable";

const PokerGame = () => {
  const {
    hand,
    gameStates,
    handHistory,
    logAction,
    startNewHand,
    fetchHandHistory,
    newGameStarted,
    setNewGameStarted,
    resetStore,
    applyStack,
    stack,
    isHumanTurn,
    gameEnded,
    setGameEnded,
    winner,
    humanPlayerPosition,
    currentPlayerId,
    pot,
    communityCard,
    amountWon,
    winnerInfo,
  } = usePokerStore();

  const actionsContainerRef = useRef<HTMLUListElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  // New state for controlling landing page vs table
  const [showTable, setShowTable] = useState(false);

  const handleStartNewHand = async () => {
    try {
      if (newGameStarted) {
        resetStore();
      } else {
        const startHandRequest: StartHandRequest = { stack };
        await startNewHand(startHandRequest);
        setNewGameStarted(!newGameStarted);
      }
    } catch (error) {
      console.error("Failed to start a new hand:", error);
    }
  };

  const handleStackChange = (value: number) => {
    applyStack(value);
  };

  useEffect(() => {
    fetchHandHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (actionsContainerRef.current) {
      actionsContainerRef.current.scrollTop =
        actionsContainerRef.current.scrollHeight;
    }
  }, [gameStates, hand]);

  // Function to transition from landing page to poker table
  const handlePlayClick = () => {
    setShowTable(true);
  };

  // Landing Page JSX
  if (!showTable) {
    return (
      <div
        className="h-screen w-full flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1567136445648-01b1b12734ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')" }} // replace with your background
      >
        <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 drop-shadow-lg mb-10 text-center">
        Poker
        </h1>
        <button
          onClick={handlePlayClick}
          className="px-12 py-2 text-2xl md:text-3xl font-semibold bg-green-900 hover:bg-green-950 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Play
        </button>
      </div>
    );
  }

  // Poker Table JSX
  return (
    <div className="h-screen overflow-hidden" data-testid="poker.game-container">
      <PokerTable
        hand={hand}
        gameStates={gameStates}
        onAction={logAction}
        isHumanTurn={isHumanTurn}
        newGameStarted={newGameStarted}
        onShowHistory={() => setShowHistory(true)}
        stack={stack}
        onStackChange={handleStackChange}
        onStartNewHand={handleStartNewHand}
        gameEnded={gameEnded}
        winner={winner}
        setGameEnded={setGameEnded}
        humanPlayerPosition={humanPlayerPosition}
        currentPlayerId={currentPlayerId}
        pot={pot}
        communityCard={communityCard}
        amountWon={amountWon}
        winnerInfo={winnerInfo}
      />

      <HandHistoryPanel
        history={handHistory}
        gameStates={gameStates}
        fetchHandHistory={fetchHandHistory}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

export default PokerGame;
