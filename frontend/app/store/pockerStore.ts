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
  gameEnded: boolean;
  winner: boolean;
  currentPlayerId: number;
  action: string;
  pot: number;
  amount: number;
  communityCard : Card[];
  applyStack : (stack : number) => void;
  setHand : (hand : Hand) => void;
  setGameState : (gameState : GameState) => void;
  setHandHistory : (history : Hand[]) => void;
  setNewGameStarted : (newGameStarted : boolean) => void;
  setGameEnded : (gameEnded : boolean) => void;
  setCurrentPlayerId : (currentPlayerId : number) => void;
  setWinner : (winner: boolean) => void;
  setAmount: (amount: number) => void;
  setHumanPlayerPosition: (position: number) => void;
  startNewHand: (startHandRequest : StartHandRequest) => Promise<void>;
  logAction: (action: Action) => Promise<void>;
  // logAIAction: (action: Action) => Promise<void>;
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
  players: [
    { id: 0, name: 'Player 1', stack: 1200, position: 'Dealer', isHuman: false, cards: []  },
    { id: 1, name: 'Player 2', stack: 850, position: 'Small Blind', isHuman: false, cards: [] },
    { id: 2, name: 'Player 3', stack: 950, position: 'Big Blind', isHuman: false, cards: [] },
    { id: 3, name: 'You', stack: 1000, position: 'Button', isHuman: true, cards: [] },
    { id: 4, name: 'Player 5', stack: 1100, position: 'MP', isHuman: false, cards: [] },
    { id: 5, name: 'Player 6', stack: 750, position: 'CO', isHuman: false, cards: [] }
  ],
}

// Initial game state
// Game play -> Player action round is over and game is over

type Card = {
  suit: string;
  rank: string;
};

function formatHand(hand: string): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < hand.length; i += 2) {
    const rank = hand[i];
    const suit = hand[i + 1];
    cards.push({ suit, rank });
  }
  return cards;
}

function switchTurn(set,get,gameState){
  if (!gameState.game_ended) {
    setTimeout(() => {
      set({currentPlayerId : (gameState.current_player + 1) % 6})
      const isHuman = get().currentPlayerId === get().humanPlayerPosition;
      set({ isHumanTurn: isHuman });

      if (!isHuman){
        get().processAITurn()
      }
      set({action : ''})

    }, 1000);
  }
}

export const usePokerStore = create<PokerState>((set, get) => ({
  stack : 1000,
  hand : sampleHand,
  gameStates : [],
  handHistory: [],
  newGameStarted: false,
  gameEnded: false,
  winner: false,
  humanPlayerPosition: 3, // Default to player 0
  isHumanTurn: false,
  currentPlayerId: 3,
  action: '',
  pot: 60,
  amount: 40,
  communityCard : [],
  applyStack : (stack: number) => set({stack}),
  setHand : (hand: Hand) => set({ hand }),
  setGameState: (gameState: GameState) => set((state) => ({ gameStates: state.gameStates.concat(gameState) })),
  setHandHistory : (history: Hand[]) => set({ handHistory: history }),
  setNewGameStarted : (newGameStarted: boolean) => set({ newGameStarted }),
  setGameEnded : (gameEnded : boolean) => set({gameEnded}),
  setWinner : (winner : boolean) => set({winner}), 
  setHumanPlayerPosition: (position: number) => set({ humanPlayerPosition: position }),
  setCurrentPlayerId : (currentPlayerId: number) => set({currentPlayerId}),
  setAmount : (amount : number) => set({amount}),
  startNewHand: async (startHandRequest: StartHandRequest) => {
    try{
      const state = get();
      const  players = state.hand.players
      players.forEach(player => {
        player.stack = state.stack
      })

      const hand = await pokerAPI.startHand(startHandRequest);
      const currentPlayerHand = hand.players_hand[3]
      const formattedHand = formatHand(currentPlayerHand)
      players[3].cards.push(...formattedHand)
      hand.players = players

      set({ hand });
       set({ isHumanTurn: true });
      debugger
    }
    catch(e){
      console.log(e)
    }
  },
  logAction: async (action: Action) => {
    try{
      const gameState = await pokerAPI.logAction(action);
      if (action.action_type === 'bet' || action.action_type === 'raise' ){

        set({action: `${action.action_type} ${action.amount ||  ''}`})
      }
      else{
        set({action: action.action_type })
      }
      set({pot : get().pot + (action.amount || 0) }) 
      set((state) => ({ gameStates: state.gameStates.concat(gameState) }));
        
      switchTurn(set,get,gameState)
    
      if (gameState.round_changed) {
          set({amount :  40})
          const roundDealings = formatHand(gameState.round_dealing[0][1])
          set({communityCard : [...get().communityCard, ...roundDealings]})
      }
          
    }
    catch(e){
      console.error(e)  
    }
  },
  // logAIAction: async (action: Action) => {
  //   debugger
  //   try{
  //     const gameState = await pokerAPI.logAction(action);
  //     set({action : action.action_type})
  //     set((state) => ({ gameStates: state.gameStates.concat(gameState) }));
      
  //     switchTurn(set,get,gameState)
    
  //   }
  //   catch(e){
  //     console.error(e)  
  //   }
  // },
  processAITurn: async () => {
    debugger
    const state = get();
    if (state.gameStates.length === 0) return;
    
    const currentState = state.gameStates[state.gameStates.length - 1];
    const isHuman = state.currentPlayerId === state.humanPlayerPosition;
    
    if (!isHuman && !currentState.game_ended) {
      const aiPlayer = new AIPlayer(get().currentPlayerId, get().amount,get().setAmount);
      const action = aiPlayer.makeDecision(currentState);
      await state.logAction(action);
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
