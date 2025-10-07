import type { LootItem } from './game';

export interface WebSocketMessage {
  action: 'attack' | 'heal' | 'reset' | 'pickLoot' | 'selectLocation';
  item?: string | LootItem;
  locationIndex?: number;
}

export interface ServerMessage {
  type: 'state';
  data: any; // BattleState will be imported where needed
}

export interface ClientMessage extends WebSocketMessage {}