// store/pokerStore.ts
'use client'
import create from 'zustand';
import {Hand,Action, GameState, StartHandRequest, Player} from '@/app/types/pockerTypes'
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
  amountWon : number;
  winnerInfo : WinnerInfo;
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
  stack : 1000,
  dealer : 0,
  small_blind : 0,
  big_blind : 0,
  small_blind_amount : 0,
  big_blind_amount : 0,
  players_hand : [],
  actions : [],
  winnings : [],
  players: [
    { id: 0, name: 'Player 1', stack: 1200, position: 'Dealer', isHuman: false, cards: [], isActive:true  },
    { id: 1, name: 'Player 2', stack: 850, position: 'Small Blind', isHuman: false, cards: [], isActive:true},
    { id: 2, name: 'Player 3', stack: 950, position: 'Big Blind', isHuman: false, cards: [], isActive:true },
    { id: 3, name: 'You', stack: 1000, position: 'Button', isHuman: true, cards: [], isActive:true },
    { id: 4, name: 'Player 5', stack: 1100, position: 'MP', isHuman: false, cards: [], isActive:true },
    { id: 5, name: 'Player 6', stack: 750, position: 'CO', isHuman: false, cards: [], isActive:true }
  ],
}

// Initial game state
// Game play -> Player action round is over and game is over

type Card = {
  suit: string;
  rank: string;
};

export type WinnerInfo = {
  name: string;
  hand: Card[];
  amount: number
}
function formatHand(hand: string): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < hand.length; i += 2) {
    const rank = hand[i];
    const suit = hand[i + 1];
    cards.push({ suit, rank });
  }
  return cards;
}

function updateStack(hand : Hand, players_stack : number[]){

  players_stack.forEach((stack, index) => {
    hand.players[index].stack = stack
  })

}

function switchTurn(set,get,gameState){
  if (!gameState.game_ended) {
    setTimeout(() => {
      set({currentPlayerId : (gameState.next_player)})
      const isHuman = get().currentPlayerId === get().humanPlayerPosition;
      set({ isHumanTurn: isHuman });

      if (!isHuman){
        get().processAITurn()
      }
      set({action : ''})

    }, 1000);
  }
}

function assignCardsToPlayers(players: Player[], hand: Hand) {
  players.forEach((player, index) => {
    const currentPlayerHand = hand.players_hand[index];
    const formattedHand = formatHand(currentPlayerHand);
    player.cards = formattedHand;
  });

  return players;
}


export const usePokerStore = create<PokerState>((set, get) => ({
  stack : 1000,
  hand : structuredClone(sampleHand),
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
  amountWon : 0,
  winnerInfo : {name : '',hand : [{suit : '',rank : ''}] , amount: 0},
  applyStack : (stack: number) => {
    debugger
    set({stack})},
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
      assignCardsToPlayers(players,hand)
      hand.players = players

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
      if (action.action_type === 'bet' || action.action_type === 'raise' ){

        set({action: `${action.action_type} ${action.amount ||  ''}`})
      }
      else{
        set({action: action.action_type })
      }

      if(gameState.total_pot_amount){

        set({pot : gameState.total_pot_amount }) 
      }
      set((state) => ({ gameStates: state.gameStates.concat(gameState) }));
        
      switchTurn(set,get,gameState)
      updateStack(get().hand, gameState.players_stacks)
    
      if (gameState.round_changed) {
          set({amount :  40})
          
          const roundDealings = formatHand(gameState.round_dealing[0][1])
          set({communityCard : [...get().communityCard, ...roundDealings]})
      }

      if (gameState.game_ended){
        set({gameEnded : true})
        if ( gameState.winnings[get().humanPlayerPosition] > 0){
          get().setWinner(true)
          set({amountWon : gameState.winnings[get().humanPlayerPosition]})
        }

        const winningIndex = gameState.winnings.findIndex(winning => winning > 0)
        
        set({
          winnerInfo : {name : get().hand.players[winningIndex].name, 
          hand : get().hand.players[winningIndex].cards,
          amount : gameState.winnings[winningIndex]}
          })
      }

      if (action.action_type == 'fold'){
        get().hand.players[get().currentPlayerId].isActive = false
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

  resetStore: () => {
    set({
    stack: 1000,
    hand: sampleHand,
    gameStates: [],
    handHistory: [],
    newGameStarted: false,
    gameEnded: false,
    winner: false,
    humanPlayerPosition: 3,
    isHumanTurn: false,
    currentPlayerId: 3,
    action: '',
    pot: 60,
    amount: 40,
    communityCard: [],
  })},
}));
