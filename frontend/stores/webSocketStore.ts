import { create } from 'zustand';
import type { BattleState } from '../types';

interface WebSocketState {
  battleState: BattleState | null;
  ws: WebSocket | null;
  setBattleState: (state: BattleState | null) => void;
  setWebSocket: (ws: WebSocket | null) => void;
  sendAction: (
    action: "attack" | "heal" | "reset" | "pickLoot" | "selectLocation",
    item?: string | { name: string; rarity: string },
    locationIndex?: number
  ) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  battleState: null,
  ws: null,
  setBattleState: (state) => set({ battleState: state }),
  setWebSocket: (ws) => set({ ws }),
  sendAction: (action, item, locationIndex) => {
    const { ws } = get();
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (action === "pickLoot" && item) {
        ws.send(JSON.stringify({ action, item }));
      } else if (action === "selectLocation" && locationIndex !== undefined) {
        ws.send(JSON.stringify({ action, locationIndex }));
      } else if (action === "heal" && item) {
        ws.send(JSON.stringify({ action, item }));
      } else {
        ws.send(JSON.stringify({ action }));
      }
    }
  },
}));