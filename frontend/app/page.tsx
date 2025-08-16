"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ActionControls from "./components/ActionControls";
import HandLog from "./components/HandLog";
import HandHistory from "./components/HandHistory";
import { Button } from "@/components/ui/button";
import { usePokerStore } from "@/app/store/pockerStore";
import { HandDescription } from "@/app/components/HandDescription";
import { StartHandRequest } from "./types/pockerTypes";
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
  } = usePokerStore();

  const [inputValue, setInputValue] = useState<string>("1000");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const actionsContainerRef = useRef<HTMLUListElement>(null);

  const handleStartNewHand = async () => {
    try {
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

  const handleApplyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const value = Number(inputValue);
    if (isNaN(value) || value <= 0) {
      alert("Please enter a valid number.");
      return;
    }
    applyStack(value);
    setConfirmationMessage(`Stack updated to ${value}`);
    console.log("Saved value:", inputValue);
    // You can add additional logic here to process the saved value
  };

  return (
    <div
      className="bg-gray-100 h-full flex text-black"
      data-testid="poker.game-container"
    >
      <div className="left-section  w-[60%] p-2 flex flex-col">
        <h1 className="text-2xl  font-bold" data-testid="poker.game-title">
          Poker Game
        </h1>
        <div className="h-[80%]  text-sm text-gray-700">
          <div className="flex justify-between flex-wrap p-2 gap-2">
            <h2>Stacks</h2>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border p-1"
              data-testid="poker.stack-input"
            />
            <Button onClick={handleApplyClick} data-testid="poker.apply-button">
              Apply
            </Button>
            <Button
              onClick={handleStartNewHand}
              data-testid="poker.start-button"
            >
              {newGameStarted ? "Restart" : "Start"}
            </Button>
          </div>
          {confirmationMessage && (
            <div
              className="text-green-500 mb-3"
              data-testid="poker.confirmation-message"
            >
              {confirmationMessage}
            </div>
          )}
          <ul
            ref={actionsContainerRef}
            className="h-[80%]  bg-white p-2 overflow-y-scroll"
          >
            <HandDescription hand={hand} newGameStarted={newGameStarted} />
            <HandLog gameStates={gameStates} newGameStarted={newGameStarted} />
          </ul>
        </div>
        <div className="w-[80%] p-3">
          <ActionControls
            onAction={logAction}
            gameStates={gameStates}
            hand={hand}
            newGameStarted={newGameStarted}
            isHumanTurn={isHumanTurn}
          />
        </div>
      </div>
      <div className="right-section text-black p-3 overflow-auto w-[40%]">
        <HandHistory
          history={handHistory}
          gameStates={gameStates}
          fetchHandHistory={fetchHandHistory}
        />
      </div>
    </div>
  );
};

export default PokerGame;
