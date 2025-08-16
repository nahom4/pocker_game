// store/pokerStore.ts
'use client'
import create from 'zustand';
import {Hand,Action, GameState, StartHandRequest} from '@/app/types/pockerTypes'
import { pokerAPI } from '../services/pockerApI';
import { AIPlayer } from '../services/aiPlayer';

interface PokerState {
  stack : number;
  hand : Hand;
  gameStates : GameState[];
  handHistory : Hand[];
  newGameStarted : boolean;
  humanPlayerPosition: number; // 0-5 for 6-player game
  isHumanTurn: boolean;
  applyStack : (stack : number) => void;
  setHand : (hand : Hand) => void;
  setGameState : (gameState : GameState) => void;
  setHandHistory : (history : Hand[]) => void;
  setNewGameStarted : (newGameStarted : boolean) => void;
  setHumanPlayerPosition: (position: number) => void;
  startNewHand: (startHandRequest : StartHandRequest) => Promise<void>;
  logAction: (action: Action) => Promise<void>;
  logAIAction: (action: Action) => Promise<void>;
  fetchHandHistory: () => Promise<void>;
  resetStore: () => void;
  processAITurn: () => Promise<void>;
}

const sampleHand =  {
  hand_uuid : '',
  stack : 0,
  dealer : 0,
  small_blind : 0,
  big_blind : 0,
  small_blind_amount : 0,
  big_blind_amount : 0,
  players_hand : [],
  actions : [],
  winnings : [],
}

// Initial game state
// Game play -> Player action round is over and game is over
export const usePokerStore = create<PokerState>((set, get) => ({
  stack : 1000,
  hand : sampleHand,
  gameStates : [],
  handHistory: [],
  newGameStarted: false,
  humanPlayerPosition: 2, // Default to player 0
  isHumanTurn: false,
  applyStack : (stack: number) => set({stack}),
  setHand : (hand: Hand) => set({ hand }),
  setGameState: (gameState: GameState) => set((state) => ({ gameStates: state.gameStates.concat(gameState) })),
  setHandHistory : (history: Hand[]) => set({ handHistory: history }),
  setNewGameStarted : (newGameStarted: boolean) => set({ newGameStarted }),
  setHumanPlayerPosition: (position: number) => set({ humanPlayerPosition: position }),
  startNewHand: async (startHandRequest: StartHandRequest) => {
    try{
      const hand = await pokerAPI.startHand(startHandRequest);
      set({ hand });
       set({ isHumanTurn: true });
    }
    catch(e){
      console.log(e)
    }
  },
  logAction: async (action: Action) => {
    try{
      const gameState = await pokerAPI.logAction(action);
      set((state) => ({ gameStates: state.gameStates.concat(gameState) }));
      
      // Check if it's human's turn next
      const isHuman = gameState.current_player === get().humanPlayerPosition;
      set({ isHumanTurn: isHuman });
      
      // If it's AI's turn, process it automatically
      if (!isHuman && !gameState.game_ended) {
        setTimeout(() => get().processAITurn(), 1000);
      }
    }
    catch(e){
      console.error(e)  
    }
  },
  logAIAction: async (action: Action) => {
    try{
      const gameState = await pokerAPI.logAction(action);
      set((state) => ({ gameStates: state.gameStates.concat(gameState) }));
      
      // Check if it's human's turn next
      const isHuman = gameState.current_player === get().humanPlayerPosition;
      set({ isHumanTurn: isHuman });
      
      // Continue AI turns if still AI's turn
      if (!isHuman && !gameState.game_ended) {
        setTimeout(() => get().processAITurn(), 1000);
      }
    }
    catch(e){
      console.error(e)  
    }
  },
  processAITurn: async () => {
    const state = get();
    if (state.gameStates.length === 0) return;
    
    const currentState = state.gameStates[state.gameStates.length - 1];
    const isHuman = currentState.current_player === state.humanPlayerPosition;
    
    if (!isHuman && !currentState.game_ended) {
      const aiPlayer = new AIPlayer(currentState.current_player);
      const action = aiPlayer.makeDecision(currentState);
      await state.logAIAction(action);
    }
  },
  fetchHandHistory: async () => {
    try{
      const handHistory = await pokerAPI.getHandHistory();
      console.log(handHistory,"handHistory from store")
      set({ handHistory });
    }
  
    catch(err){

    }
  },

  resetStore: () => set({
    hand: sampleHand,
    gameStates: [],
  }),
}));
