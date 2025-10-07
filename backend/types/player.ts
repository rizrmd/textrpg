import type { BattleState } from './game';
import type { ServerWebSocket } from 'bun';

export interface PlayerSession {
  id: string;
  playerId: string;
  battleState: BattleState;
  ws: ServerWebSocket<unknown>;
  enemyAttackInterval?: ReturnType<typeof setInterval> | null;
  lastActivity: number;
  connected: boolean;
}

export interface PlayerData {
  id: string;
  name: string;
  createdAt: number;
  lastPlayedAt: number;
  stats: {
    totalBattles: number;
    totalWins: number;
    totalDefeats: number;
    locationsCleared: number;
  };
}