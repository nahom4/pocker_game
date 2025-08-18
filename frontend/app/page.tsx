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
    communityCard
    
  } = usePokerStore();

  // const [inputValue, setInputValue] = useState<string>("1000");
  // const [confirmationMessage, setConfirmationMessage] = useState("");
  const actionsContainerRef = useRef<HTMLUListElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleStartNewHand = async () => {
    try {
      debugger
      if (newGameStarted) {
        resetStore();
      } else {
        const startHandRequest: StartHandRequest = { stack };
        await startNewHand(startHandRequest);
      }
      setNewGameStarted(!newGameStarted);
    } catch (error) {
      console.error("Failed to start a new hand:", error);
    }
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

  // const handleApplyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();

  //   const value = Number(inputValue);
  //   if (isNaN(value) || value <= 0) {
  //     alert("Please enter a valid number.");
  //     return;
  //   }
  //   applyStack(value);
  //   setConfirmationMessage(`Stack updated to ${value}`);
  //   console.log("Saved value:", inputValue);
  //   // You can add additional logic here to process the saved value
  // };
  const handleStackChange = (value : number) => {
    applyStack(value);
  };

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
        humanPlayerPosition= {humanPlayerPosition}
        currentPlayerId = {currentPlayerId}
        pot={pot}
        communityCard={communityCard}
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
