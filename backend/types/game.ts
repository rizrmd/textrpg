export interface Character {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  level: number;
  experience: number;
  currentLocationIndex: number;
  equipment: {
    weapon?: string;
    armor?: string;
    shield?: string;
    helmet?: string;
    boots?: string;
    ring?: string;
    amulet?: string;
  };
  inventory: LootItem[];
}

export interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  minLevel: number;
  maxLevel: number;
  experienceValue: number;
  abilities: EnemyAbility[];
}

export interface EnemyAbility {
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special';
  effect?: number;
}

export type LootItem = { name: string; rarity: string };

export interface Location {
  name: string;
  enemies: Enemy[];
  defeated: number;
  connections: number[]; // Index of connected locations
}

export interface BattleState {
  player: Character;
  enemy: Enemy;
  enemyImageUrl: string;
  battleLog: string[];
  lootPhase: boolean;
  availableLoot: { name: string; rarity: string }[];
  locations: Location[];
  waitingForNext: boolean;
  countdown: number;
  locationSelectionPhase: boolean;
  loadingEnemyImage: boolean;
}