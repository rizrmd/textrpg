// Re-export types from backend
export type {
  Character,
  Enemy,
  Location,
  BattleState,
  LootItem
} from '../backend/types/game';

export interface FlyingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  target: "player" | "enemy";
}

export interface Cooldowns {
  attack: number;
}