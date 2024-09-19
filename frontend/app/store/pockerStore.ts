// store/pokerStore.ts
'use client'
import create from 'zustand';
import {Hand,Action, GameState, StartHandRequest} from '@/app/types/pockerTypes'
import { pokerAPI } from '../services/pockerApI';

interface PokerState {
  stack : number;
  hand : Hand;
  gameStates : GameState[];
  handHistory : Hand[];
  newGameStarted : boolean;
  applyStack : (stack : number) => void;
  setHand : (hand : Hand) => void;
  setGameState : (gameState : GameState) => void;
  setHandHistory : (history : Hand[]) => void;
  setNewGameStarted : (newGameStarted : boolean) => void;
  startNewHand: (startHandRequest : StartHandRequest) => Promise<void>;
  logAction: (action: Action) => Promise<void>;
  fetchHandHistory: () => Promise<void>;
  resetStore: () => void;
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
export const usePokerStore = create<PokerState>((set) => ({
  stack : 1000,
    hand : sampleHand,
  gameStates : [],
  handHistory: [],
  newGameStarted: false,
  applyStack : (stack) => set({stack}),
  setHand : (hand) => set({ hand }),
  setGameState: (gameState) => set((state) => ({ gameStates: state.gameStates.concat(gameState) })),
  setHandHistory: (history) => set({ handHistory: history }),
  setNewGameStarted: (newGameStarted) => set({ newGameStarted }),
  startNewHand: async (stack) => {
    const hand = await pokerAPI.startHand(stack);
    // console.log(hand,"hand from store")
    set({ hand });
  },
  logAction: async (action: Action) => {
    const gameState = await pokerAPI.logAction(action);
    set((state) => ({ gameStates: state.gameStates.concat(gameState) }));
    console.log(gameState,"gameState from store")
  },
  fetchHandHistory: async () => {
    const handHistory = await pokerAPI.getHandHistory();
    console.log(handHistory,"handHistory from store")
    set({ handHistory });
  },
  resetStore: () => set({
    hand: sampleHand,
    gameStates: [],
  }),
}));
