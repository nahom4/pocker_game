import axios from 'axios';
import { Action, Hand, GameState, StartHandRequest } from "../types/pockerTypes";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1` || 'http://localhost:8000/api/v1';

export const pokerAPI = {
  startHand: async (startHandRequest : StartHandRequest): Promise<Hand> => {
    const { data } = await axios.post(`${API_BASE_URL}/hand/start`,startHandRequest);
    return data as Hand;
  },
  logAction: async (action: Action): Promise<GameState> => {
    const { data } = await axios.post(`${API_BASE_URL}/hand/action`, action);
    return data as GameState;
  },
  getHandHistory: async (): Promise<Hand[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/hand/history`);
    return data as Hand[];
  }
};