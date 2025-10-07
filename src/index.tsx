import index from "./index.html";

interface Character {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
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

interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  abilities: EnemyAbility[];
}

interface EnemyAbility {
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special';
  effect?: number;
}

type LootItem = { name: string; rarity: string };

interface Location {
  name: string;
  enemies: Enemy[];
  defeated: number;
  connections: number[]; // Index of connected locations
}

interface BattleState {
  player: Character;
  enemy: Enemy;
  enemyImageUrl: string;
  battleLog: string[];
  isPlayerTurn: boolean;
  lootPhase: boolean;
  availableLoot: { name: string; rarity: string }[];
  currentLocationIndex: number;
  locations: Location[];
  waitingForNext: boolean;
  countdown: number;
  locationSelectionPhase: boolean;
}

const locations: Location[] = [
  {
    name: 'Forest',
    enemies: [
      { 
        name: 'Goblin', 
        hp: 50, 
        maxHp: 50, 
        attack: 10, 
        defense: 2,
        abilities: [
          { name: 'Quick Strike', description: 'Fast attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 5 }
        ]
      },
      { 
        name: 'Forest Spider', 
        hp: 35, 
        maxHp: 35, 
        attack: 8, 
        defense: 1,
        abilities: [
          { name: 'Poison Bite', description: 'Poison damage over time', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 3 }
        ]
      },
      { 
        name: 'Wolf', 
        hp: 45, 
        maxHp: 45, 
        attack: 12, 
        defense: 3,
        abilities: [
          { name: 'Pack Howl', description: 'Increases attack', cooldown: 5, currentCooldown: 0, type: 'buff', effect: 3 }
        ]
      },
      { 
        name: 'Treant', 
        hp: 80, 
        maxHp: 80, 
        attack: 15, 
        defense: 8,
        abilities: [
          { name: 'Root Bind', description: 'Stuns player', cooldown: 6, currentCooldown: 0, type: 'special' },
          { name: 'Nature Heal', description: 'Heals itself', cooldown: 4, currentCooldown: 0, type: 'heal', effect: 15 }
        ]
      },
      { 
        name: 'Forest Sprite', 
        hp: 30, 
        maxHp: 30, 
        attack: 6, 
        defense: 1,
        abilities: [
          { name: 'Healing Dust', description: 'Heals allies', cooldown: 3, currentCooldown: 0, type: 'heal', effect: 10 }
        ]
      }
    ],
    defeated: 0,
    connections: [1, 2, 5]
  },
  {
    name: 'Cave',
    enemies: [
      { 
        name: 'Bat', 
        hp: 40, 
        maxHp: 40, 
        attack: 8, 
        defense: 1,
        abilities: [
          { name: 'Echolocation', description: 'Increases accuracy', cooldown: 4, currentCooldown: 0, type: 'buff', effect: 2 }
        ]
      },
      { 
        name: 'Cave Troll', 
        hp: 120, 
        maxHp: 120, 
        attack: 18, 
        defense: 6,
        abilities: [
          { name: 'Club Smash', description: 'Heavy damage', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 10 },
          { name: 'Rage', description: 'Berserk mode', cooldown: 8, currentCooldown: 0, type: 'buff', effect: 5 }
        ]
      },
      { 
        name: 'Slime', 
        hp: 60, 
        maxHp: 60, 
        attack: 7, 
        defense: 4,
        abilities: [
          { name: 'Acid Spit', description: 'Corrosive damage', cooldown: 3, currentCooldown: 0, type: 'debuff', effect: 4 },
          { name: 'Split', description: 'Duplicates when low health', cooldown: 10, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Golem', 
        hp: 100, 
        maxHp: 100, 
        attack: 14, 
        defense: 10,
        abilities: [
          { name: 'Stone Skin', description: 'Increases defense', cooldown: 5, currentCooldown: 0, type: 'buff', effect: 3 }
        ]
      },
      { 
        name: 'Shadow Lurker', 
        hp: 55, 
        maxHp: 55, 
        attack: 16, 
        defense: 2,
        abilities: [
          { name: 'Shadow Strike', description: 'Attack from shadows', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 8 },
          { name: 'Vanish', description: 'Become invisible', cooldown: 6, currentCooldown: 0, type: 'special' }
        ]
      }
    ],
    defeated: 0,
    connections: [0, 3, 6]
  },
  {
    name: 'Swamp',
    enemies: [
      { 
        name: 'Crocodile', 
        hp: 70, 
        maxHp: 70, 
        attack: 14, 
        defense: 5,
        abilities: [
          { name: 'Death Roll', description: 'Powerful bite', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 12 }
        ]
      },
      { 
        name: 'Will-o-Wisp', 
        hp: 25, 
        maxHp: 25, 
        attack: 10, 
        defense: 0,
        abilities: [
          { name: 'Confuse', description: 'Confuses player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 2 },
          { name: 'Teleport', description: 'Random movement', cooldown: 3, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Swamp Hag', 
        hp: 65, 
        maxHp: 65, 
        attack: 12, 
        defense: 3,
        abilities: [
          { name: 'Curse', description: 'Weakens player', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 3 },
          { name: 'Voodoo Doll', description: 'Reflects damage', cooldown: 7, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Giant Frog', 
        hp: 50, 
        maxHp: 50, 
        attack: 11, 
        defense: 4,
        abilities: [
          { name: 'Tongue Grab', description: 'Pulls player close', cooldown: 3, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Moss Golem', 
        hp: 90, 
        maxHp: 90, 
        attack: 13, 
        defense: 7,
        abilities: [
          { name: 'Regenerate', description: 'Heals over time', cooldown: 5, currentCooldown: 0, type: 'heal', effect: 8 },
          { name: 'Spore Cloud', description: 'Poisons area', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 5 }
        ]
      }
    ],
    defeated: 0,
    connections: [0, 4, 7]
  },
  {
    name: 'Desert',
    enemies: [
      { 
        name: 'Scorpion', 
        hp: 45, 
        maxHp: 45, 
        attack: 11, 
        defense: 2,
        abilities: [
          { name: 'Venom Sting', description: 'Poison attack', cooldown: 3, currentCooldown: 0, type: 'debuff', effect: 4 }
        ]
      },
      { 
        name: 'Vulture', 
        hp: 35, 
        maxHp: 35, 
        attack: 9, 
        defense: 1,
        abilities: [
          { name: 'Dive Bomb', description: 'Aerial attack', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 7 }
        ]
      },
      { 
        name: 'Sand Worm', 
        hp: 95, 
        maxHp: 95, 
        attack: 17, 
        defense: 6,
        abilities: [
          { name: 'Swallow', description: 'Deals heavy damage', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 15 },
          { name: 'Burrow', description: 'Underground attack', cooldown: 4, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Desert Nomad', 
        hp: 60, 
        maxHp: 60, 
        attack: 14, 
        defense: 4,
        abilities: [
          { name: 'Sand Storm', description: 'Blinds player', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 3 },
          { name: 'Camouflage', description: 'Hides in sand', cooldown: 5, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Mummy', 
        hp: 80, 
        maxHp: 80, 
        attack: 13, 
        defense: 5,
        abilities: [
          { name: 'Curse Touch', description: 'Weakens player', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 4 },
          { name: 'Bandage Wrap', description: 'Heals itself', cooldown: 5, currentCooldown: 0, type: 'heal', effect: 12 }
        ]
      }
    ],
    defeated: 0,
    connections: [2, 5, 8]
  },
  {
    name: 'Mountain',
    enemies: [
      { 
        name: 'Eagle', 
        hp: 38, 
        maxHp: 38, 
        attack: 10, 
        defense: 1,
        abilities: [
          { name: 'Talons', description: 'Sharp attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 6 }
        ]
      },
      { 
        name: 'Yeti', 
        hp: 85, 
        maxHp: 85, 
        attack: 16, 
        defense: 5,
        abilities: [
          { name: 'Ice Breath', description: 'Freezes player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 5 },
          { name: 'Roar', description: 'Scares player', cooldown: 6, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Giant', 
        hp: 110, 
        maxHp: 110, 
        attack: 22, 
        defense: 9,
        abilities: [
          { name: 'Rock Throw', description: 'Long range attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 10 },
          { name: 'Stomp', description: 'Area damage', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 8 }
        ]
      },
      { 
        name: 'Mountain Lion', 
        hp: 55, 
        maxHp: 55, 
        attack: 15, 
        defense: 3,
        abilities: [
          { name: 'Pounce', description: 'Leaping attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 9 }
        ]
      },
      { 
        name: 'Harpy', 
        hp: 45, 
        maxHp: 45, 
        attack: 13, 
        defense: 2,
        abilities: [
          { name: 'Siren Song', description: 'Charms player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 4 },
          { name: 'Wind Gust', description: 'Pushes player back', cooldown: 4, currentCooldown: 0, type: 'special' }
        ]
      }
    ],
    defeated: 0,
    connections: [0, 4, 9]
  },
  {
    name: 'Castle',
    enemies: [
      { 
        name: 'Skeleton', 
        hp: 55, 
        maxHp: 55, 
        attack: 13, 
        defense: 4,
        abilities: [
          { name: 'Bone Throw', description: 'Ranged attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 6 }
        ]
      },
      { 
        name: 'Dark Knight', 
        hp: 100, 
        maxHp: 100, 
        attack: 20, 
        defense: 8,
        abilities: [
          { name: 'Shield Bash', description: 'Stuns player', cooldown: 4, currentCooldown: 0, type: 'special' },
          { name: 'Holy Strike', description: 'Light damage', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 12 }
        ]
      },
      { 
        name: 'Lich', 
        hp: 120, 
        maxHp: 120, 
        attack: 25, 
        defense: 6,
        abilities: [
          { name: 'Life Drain', description: 'Steals health', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 },
          { name: 'Raise Dead', description: 'Summons minions', cooldown: 8, currentCooldown: 0, type: 'special' },
          { name: 'Ice Bolt', description: 'Magic attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 10 }
        ]
      },
      { 
        name: 'Dragon', 
        hp: 150, 
        maxHp: 150, 
        attack: 30, 
        defense: 10,
        abilities: [
          { name: 'Fire Breath', description: 'Burns area', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 20 },
          { name: 'Tail Sweep', description: 'Area attack', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 },
          { name: 'Wing Gust', description: 'Wind attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 10 }
        ]
      },
      { 
        name: 'Castle Guard', 
        hp: 75, 
        maxHp: 75, 
        attack: 16, 
        defense: 7,
        abilities: [
          { name: 'Formation', description: 'Defense boost', cooldown: 5, currentCooldown: 0, type: 'buff', effect: 3 }
        ]
      }
    ],
    defeated: 0,
    connections: [1, 7, 10]
  },
  {
    name: 'Volcano',
    enemies: [
      { 
        name: 'Fire Elemental', 
        hp: 65, 
        maxHp: 65, 
        attack: 18, 
        defense: 3,
        abilities: [
          { name: 'Inferno', description: 'Burns player', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 14 },
          { name: 'Fire Shield', description: 'Burns attackers', cooldown: 6, currentCooldown: 0, type: 'buff', effect: 5 }
        ]
      },
      { 
        name: 'Lava Golem', 
        hp: 130, 
        maxHp: 130, 
        attack: 20, 
        defense: 12,
        abilities: [
          { name: 'Lava Spit', description: 'Melts armor', cooldown: 3, currentCooldown: 0, type: 'debuff', effect: 6 },
          { name: 'Magma Form', description: 'Immune to damage', cooldown: 8, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Phoenix', 
        hp: 90, 
        maxHp: 90, 
        attack: 22, 
        defense: 5,
        abilities: [
          { name: 'Rebirth', description: 'Revives once', cooldown: 10, currentCooldown: 0, type: 'special' },
          { name: 'Flame Wing', description: 'Fire attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 12 }
        ]
      },
      { 
        name: 'Imp', 
        hp: 30, 
        maxHp: 30, 
        attack: 12, 
        defense: 2,
        abilities: [
          { name: 'Hellfire', description: 'Small fire attack', cooldown: 2, currentCooldown: 0, type: 'damage', effect: 8 }
        ]
      },
      { 
        name: 'Molten Beast', 
        hp: 100, 
        maxHp: 100, 
        attack: 19, 
        defense: 8,
        abilities: [
          { name: 'Melt Armor', description: 'Reduces defense', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 4 },
          { name: 'Eruption', description: 'Explosive attack', cooldown: 6, currentCooldown: 0, type: 'damage', effect: 18 }
        ]
      }
    ],
    defeated: 0,
    connections: [2, 6, 11]
  },
  {
    name: 'Tundra',
    enemies: [
      { 
        name: 'Ice Wolf', 
        hp: 50, 
        maxHp: 50, 
        attack: 14, 
        defense: 4,
        abilities: [
          { name: 'Frost Bite', description: 'Slows player', cooldown: 3, currentCooldown: 0, type: 'debuff', effect: 5 }
        ]
      },
      { 
        name: 'Frost Giant', 
        hp: 140, 
        maxHp: 140, 
        attack: 24, 
        defense: 11,
        abilities: [
          { name: 'Ice Hammer', description: 'Freezes player', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 16 },
          { name: 'Blizzard', description: 'Area slow', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 6 }
        ]
      },
      { 
        name: 'Snow Leopard', 
        hp: 60, 
        maxHp: 60, 
        attack: 17, 
        defense: 3,
        abilities: [
          { name: 'Pounce', description: 'Quick attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 11 }
        ]
      },
      { 
        name: 'Ice Elemental', 
        hp: 70, 
        maxHp: 70, 
        attack: 16, 
        defense: 6,
        abilities: [
          { name: 'Ice Shard', description: 'Sharp ice attack', cooldown: 2, currentCooldown: 0, type: 'damage', effect: 9 },
          { name: 'Freeze', description: 'Stuns player', cooldown: 5, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Polar Bear', 
        hp: 95, 
        maxHp: 95, 
        attack: 19, 
        defense: 7,
        abilities: [
          { name: 'Maul', description: 'Heavy attack', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 14 }
        ]
      }
    ],
    defeated: 0,
    connections: [3, 8, 12]
  },
  {
    name: 'Ocean',
    enemies: [
      { 
        name: 'Shark', 
        hp: 75, 
        maxHp: 75, 
        attack: 18, 
        defense: 5,
        abilities: [
          { name: 'Blood Frenzy', description: 'Berserk when wounded', cooldown: 4, currentCooldown: 0, type: 'buff', effect: 4 }
        ]
      },
      { 
        name: 'Kraken', 
        hp: 160, 
        maxHp: 160, 
        attack: 28, 
        defense: 9,
        abilities: [
          { name: 'Tentacle Grab', description: 'Holds player', cooldown: 3, currentCooldown: 0, type: 'special' },
          { name: 'Ink Cloud', description: 'Blinds player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 5 },
          { name: 'Whirlpool', description: 'Area damage', cooldown: 7, currentCooldown: 0, type: 'damage', effect: 20 }
        ]
      },
      { 
        name: 'Mermaid', 
        hp: 55, 
        maxHp: 55, 
        attack: 15, 
        defense: 4,
        abilities: [
          { name: 'Siren Call', description: 'Charms player', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 4 },
          { name: 'Healing Waters', description: 'Heals itself', cooldown: 5, currentCooldown: 0, type: 'heal', effect: 15 }
        ]
      },
      { 
        name: 'Sea Serpent', 
        hp: 120, 
        maxHp: 120, 
        attack: 23, 
        defense: 7,
        abilities: [
          { name: 'Constrict', description: 'Crushing hold', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 },
          { name: 'Tidal Wave', description: 'Water attack', cooldown: 6, currentCooldown: 0, type: 'damage', effect: 18 }
        ]
      },
      { 
        name: 'Pirate Ghost', 
        hp: 65, 
        maxHp: 65, 
        attack: 17, 
        defense: 3,
        abilities: [
          { name: 'Ghostly Curse', description: 'Weakens player', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 5 },
          { name: 'Phase Shift', description: 'Intangible', cooldown: 6, currentCooldown: 0, type: 'special' }
        ]
      }
    ],
    defeated: 0,
    connections: [4, 7, 9]
  },
  {
    name: 'Sky Realm',
    enemies: [
      { 
        name: 'Thunderbird', 
        hp: 80, 
        maxHp: 80, 
        attack: 20, 
        defense: 4,
        abilities: [
          { name: 'Lightning Strike', description: 'Electric attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 14 },
          { name: 'Thunder Clap', description: 'Stuns player', cooldown: 5, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Cloud Giant', 
        hp: 135, 
        maxHp: 135, 
        attack: 26, 
        defense: 10,
        abilities: [
          { name: 'Wind Punch', description: 'Air blast', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 12 },
          { name: 'Cloud Form', description: 'Evades attacks', cooldown: 6, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Storm Elemental', 
        hp: 90, 
        maxHp: 90, 
        attack: 22, 
        defense: 6,
        abilities: [
          { name: 'Chain Lightning', description: 'Multiple hits', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 16 },
          { name: 'Cyclone', description: 'Area damage', cooldown: 6, currentCooldown: 0, type: 'damage', effect: 18 }
        ]
      },
      { 
        name: 'Angel', 
        hp: 100, 
        maxHp: 100, 
        attack: 21, 
        defense: 8,
        abilities: [
          { name: 'Holy Light', description: 'Divine damage', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 },
          { name: 'Divine Heal', description: 'Full heal', cooldown: 8, currentCooldown: 0, type: 'heal', effect: 50 }
        ]
      },
      { 
        name: 'Roc', 
        hp: 110, 
        maxHp: 110, 
        attack: 24, 
        defense: 7,
        abilities: [
          { name: 'Talons', description: 'Sharp attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 13 },
          { name: 'Wind Dive', description: 'Aerial assault', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 16 }
        ]
      }
    ],
    defeated: 0,
    connections: [5, 8, 10]
  },
  {
    name: 'Abyss',
    enemies: [
      { 
        name: 'Demon', 
        hp: 95, 
        maxHp: 95, 
        attack: 25, 
        defense: 6,
        abilities: [
          { name: 'Hellfire', description: 'Burns soul', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 18 },
          { name: 'Soul Drain', description: 'Steals life', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 }
        ]
      },
      { 
        name: 'Devil', 
        hp: 150, 
        maxHp: 150, 
        attack: 32, 
        defense: 12,
        abilities: [
          { name: 'Contract', description: 'Curses player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 8 },
          { name: 'Hell Portal', description: 'Summons demons', cooldown: 8, currentCooldown: 0, type: 'special' },
          { name: 'Darkness', description: 'Blinds all', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 6 }
        ]
      },
      { 
        name: 'Shadow Beast', 
        hp: 110, 
        maxHp: 110, 
        attack: 27, 
        defense: 8,
        abilities: [
          { name: 'Shadow Claw', description: 'Dark damage', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 16 },
          { name: 'Phase Shift', description: 'Teleports', cooldown: 4, currentCooldown: 0, type: 'special' }
        ]
      },
      { 
        name: 'Chaos Dragon', 
        hp: 200, 
        maxHp: 200, 
        attack: 35, 
        defense: 15,
        abilities: [
          { name: 'Chaos Breath', description: 'Random effect', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 25 },
          { name: 'Reality Warp', description: 'Changes battlefield', cooldown: 7, currentCooldown: 0, type: 'special' },
          { name: 'Destroy', description: 'Ultimate attack', cooldown: 10, currentCooldown: 0, type: 'damage', effect: 40 }
        ]
      },
      { 
        name: 'Void Walker', 
        hp: 85, 
        maxHp: 85, 
        attack: 23, 
        defense: 7,
        abilities: [
          { name: 'Void Touch', description: 'Erases defense', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 7 },
          { name: 'Dimension Rift', description: 'Space attack', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 19 }
        ]
      }
    ],
    defeated: 0,
    connections: [6, 9]
  }
];

let enemyAttackInterval: ReturnType<typeof setInterval> | null = null;

let battleState: BattleState = {
  player: {
    name: 'Hero',
    hp: 100,
    maxHp: 100,
    attack: 15,
    defense: 5,
    equipment: {},
    inventory: [] as LootItem[]
  },
  enemy: locations[0]!.enemies[0]!,
  enemyImageUrl: generateEnemyImageUrl(locations[0]!.enemies[0]!.name, locations[0]!.name, locations[0]!.enemies[0]!.abilities),
  battleLog: ['A wild Goblin appears!'],
  isPlayerTurn: true,
  lootPhase: false,
  availableLoot: [] as LootItem[],
  currentLocationIndex: 0,
  locations: locations.map(loc => ({ ...loc, enemies: [...loc.enemies], connections: [...loc.connections] })),
  waitingForNext: false,
  countdown: 0,
  locationSelectionPhase: false
};

// Start enemy attack when server starts
setTimeout(() => startEnemyAttack(), 1000);

const clients = new Set<any>();

function generateLoot(): LootItem[] {
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)]!;
  const itemTypes = ['Sword', 'Shield', 'Armor', 'Scroll', 'Bow', 'Dagger', 'Helmet', 'Boots', 'Ring', 'Amulet'];
  const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)]!;
  const itemName = `${battleState.enemy.name} ${itemType}`;
  return [{ name: itemName, rarity }];
}

function generateEnemyImageUrl(enemyName: string, locationName: string, abilities?: EnemyAbility[]): string {
  // Generate the potential loot this enemy will drop
  const itemTypes = ['Sword', 'Shield', 'Armor', 'Scroll', 'Bow', 'Dagger', 'Helmet', 'Boots', 'Ring', 'Amulet'];
  const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)]!;
  const itemName = `${enemyName} ${itemType}`;
  
  // Add ability descriptions to the prompt
  let abilityDescription = '';
  if (abilities && abilities.length > 0) {
    const primaryAbility = abilities[0];
    if (primaryAbility) {
      if (primaryAbility.type === 'damage' && primaryAbility.name.includes('Fire')) {
        abilityDescription = 'with glowing fire effects and flames';
      } else if (primaryAbility.type === 'damage' && primaryAbility.name.includes('Ice')) {
        abilityDescription = 'with icy blue aura and frost effects';
      } else if (primaryAbility.type === 'damage' && primaryAbility.name.includes('Lightning')) {
        abilityDescription = 'with electric sparks and lightning effects';
      } else if (primaryAbility.type === 'heal') {
        abilityDescription = 'with green healing aura and magical energy';
      } else if (primaryAbility.type === 'special' && (primaryAbility.name.includes('Shadow') || primaryAbility.name.includes('Dark'))) {
        abilityDescription = 'with dark shadowy aura and mysterious energy';
      } else if (primaryAbility.type === 'special' && (primaryAbility.name.includes('Holy') || primaryAbility.name.includes('Light'))) {
        abilityDescription = 'with divine golden aura and holy light';
      } else if (primaryAbility.name.includes('Poison') || primaryAbility.name.includes('Venom')) {
        abilityDescription = 'with toxic green glow and poison effects';
      } else if (primaryAbility.name.includes('Stone') || primaryAbility.name.includes('Rock')) {
        abilityDescription = 'with rocky texture and earthy appearance';
      } else {
        abilityDescription = 'with magical energy and special effects';
      }
    }
  }
  
  const prompt = `A fierce ${enemyName} in the ${locationName}, fantasy art style, facing forward in a ready to attack stance ${abilityDescription}, carrying or wearing a ${itemType}, the enemy will drop ${itemName} when defeated`;
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://pollinations.ai/p/${encodedPrompt}?width=450&height=330&nologo=true`;
}

function broadcastState() {
  const message = JSON.stringify({ type: 'state', data: battleState });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function addToBattleLog(message: string) {
  battleState.battleLog = [...battleState.battleLog.slice(-4), message];
}

function playerAttack() {
  if (battleState.player.hp <= 0 || battleState.enemy.hp <= 0 || battleState.lootPhase || battleState.waitingForNext) {
    return;
  }

  const damage = Math.max(1, battleState.player.attack - battleState.enemy.defense + Math.floor(Math.random() * 5));
  battleState.enemy.hp = Math.max(0, battleState.enemy.hp - damage);
  addToBattleLog(`${battleState.player.name} deals ${damage} damage to ${battleState.enemy.name}!`);

  if (battleState.enemy.hp <= 0) {
    stopEnemyAttack(); // Stop enemy attacks when enemy defeated
    addToBattleLog(`${battleState.enemy.name} has been defeated!`);
    battleState.lootPhase = true;
    battleState.availableLoot = generateLoot();
    addToBattleLog(`${battleState.enemy.name} dropped items!`);
    broadcastState();
    return;
  }

  broadcastState();
}

// Enemy attacks continuously in real-time

function startEnemyAttack() {
  if (enemyAttackInterval) {
    clearInterval(enemyAttackInterval);
    enemyAttackInterval = null;
  }

  enemyAttackInterval = setInterval(() => {
    // Check if enemy is dead at the start of this attack cycle
    if (battleState.enemy.hp <= 0) {
      console.log('Enemy is dead, stopping attacks');
      if (enemyAttackInterval) {
        clearInterval(enemyAttackInterval);
        enemyAttackInterval = null;
      }
      return;
    }

    // Check other stop conditions
    if (battleState.player.hp <= 0 || battleState.lootPhase || battleState.waitingForNext) {
      console.log('Battle paused, stopping attacks');
      if (enemyAttackInterval) {
        clearInterval(enemyAttackInterval);
        enemyAttackInterval = null;
      }
      return;
    }

    // Regular attack
    const damage = Math.max(1, battleState.enemy.attack - battleState.player.defense + Math.floor(Math.random() * 5));
    battleState.player.hp = Math.max(0, battleState.player.hp - damage);
    addToBattleLog(`${battleState.enemy.name} deals ${damage} damage to ${battleState.player.name}!`);

    // Check and execute abilities
    battleState.enemy.abilities.forEach(ability => {
      if (ability.currentCooldown > 0) {
        ability.currentCooldown--;
      }
      
      if (ability.currentCooldown === 0 && Math.random() < 0.3) { // 30% chance to use ability when ready
        executeEnemyAbility(ability);
        ability.currentCooldown = ability.cooldown;
      }
    });

    if (battleState.player.hp <= 0) {
      addToBattleLog(`${battleState.player.name} has been defeated!`);
      battleState.lootPhase = true;
      battleState.availableLoot = [{ name: 'Restart', rarity: '' }];
      addToBattleLog('Game Over! Choose to restart.');
      if (enemyAttackInterval) {
        clearInterval(enemyAttackInterval);
        enemyAttackInterval = null;
      }
    }

    broadcastState();
  }, 2000); // Enemy attacks every 2 seconds

  console.log('Enemy attack started, enemy HP:', battleState.enemy.hp);
}

function executeEnemyAbility(ability: EnemyAbility) {
  switch (ability.type) {
    case 'damage':
      const damage = Math.max(1, (ability.effect || 10) - battleState.player.defense + Math.floor(Math.random() * 3));
      battleState.player.hp = Math.max(0, battleState.player.hp - damage);
      addToBattleLog(`${battleState.enemy.name} uses ${ability.name}! Deals ${damage} damage!`);
      break;
      
    case 'heal':
      const healAmount = ability.effect || 15;
      const actualHeal = Math.min(battleState.enemy.maxHp - battleState.enemy.hp, healAmount);
      battleState.enemy.hp += actualHeal;
      addToBattleLog(`${battleState.enemy.name} uses ${ability.name}! Heals ${actualHeal} HP!`);
      break;
      
    case 'buff':
      addToBattleLog(`${battleState.enemy.name} uses ${ability.name}! Becomes stronger!`);
      // For simplicity, just add to attack/defense temporarily
      battleState.enemy.attack += (ability.effect || 3);
      battleState.enemy.defense += Math.floor((ability.effect || 3) / 2);
      break;
      
    case 'debuff':
      addToBattleLog(`${battleState.enemy.name} uses ${ability.name}! Weakens ${battleState.player.name}!`);
      // For simplicity, just reduce player attack/defense temporarily
      battleState.player.attack = Math.max(1, battleState.player.attack - (ability.effect || 3));
      battleState.player.defense = Math.max(0, battleState.player.defense - Math.floor((ability.effect || 3) / 2));
      break;
      
    case 'special':
      addToBattleLog(`${battleState.enemy.name} uses ${ability.name}! Special effect!`);
      // Special abilities could have unique effects
      if (ability.name.includes('Stun') || ability.name.includes('Freeze')) {
        addToBattleLog(`${battleState.player.name} is stunned!`);
      } else if (ability.name.includes('Heal')) {
        const specialHeal = ability.effect || 20;
        const actualSpecialHeal = Math.min(battleState.enemy.maxHp - battleState.enemy.hp, specialHeal);
        battleState.enemy.hp += actualSpecialHeal;
        addToBattleLog(`${battleState.enemy.name} restores ${actualSpecialHeal} HP!`);
      }
      break;
  }
}

function stopEnemyAttack() {
  if (enemyAttackInterval) {
    clearInterval(enemyAttackInterval);
    enemyAttackInterval = null;
  }
}

function playerHeal() {
  if (battleState.player.hp <= 0 || battleState.enemy.hp <= 0 || battleState.lootPhase || battleState.waitingForNext) {
    return;
  }

  const healAmount = 20;
  battleState.player.hp = Math.min(battleState.player.maxHp, battleState.player.hp + healAmount);
  addToBattleLog(`${battleState.player.name} heals for ${healAmount} HP!`);

  broadcastState();
}

function getNextEnemy(): Enemy | null {
  const currentLocation = battleState.locations[battleState.currentLocationIndex]!;

  // Check if all enemies in current location are defeated
  if (currentLocation.defeated >= currentLocation.enemies.length) {
    // Move to next location
    if (battleState.currentLocationIndex < battleState.locations.length - 1) {
      battleState.currentLocationIndex++;
      const nextLocation = battleState.locations[battleState.currentLocationIndex]!;

      // If next location is also fully defeated, continue searching
      if (nextLocation.defeated >= nextLocation.enemies.length) {
        return getNextEnemy(); // Recursively find next available enemy
      }

      const nextLocationEnemy = nextLocation.enemies[nextLocation.defeated]!;
      return {
        name: nextLocationEnemy.name,
        hp: nextLocationEnemy.maxHp, // Reset HP to max
        maxHp: nextLocationEnemy.maxHp,
        attack: nextLocationEnemy.attack,
        defense: nextLocationEnemy.defense,
        abilities: nextLocationEnemy.abilities.map(ability => ({ ...ability, currentCooldown: 0 }))
      };
    }

    // All locations completed
    return null;
  }

  // Get next enemy from current location
  const nextEnemy = currentLocation.enemies[currentLocation.defeated]!;
  return {
    name: nextEnemy.name,
    hp: nextEnemy.maxHp, // Reset HP to max
    maxHp: nextEnemy.maxHp,
    attack: nextEnemy.attack,
    defense: nextEnemy.defense,
    abilities: nextEnemy.abilities.map(ability => ({ ...ability, currentCooldown: 0 }))
  };
}

function pickLoot(item: string | LootItem) {
  if (typeof item === 'string') {
    if (item === 'Restart') {
      resetBattle();
      return;
    }
    if (item === 'Skip') {
      addToBattleLog('You skipped the loot!');
      battleState.lootPhase = false;
      battleState.waitingForNext = true;
      battleState.countdown = 1;
      addToBattleLog('Continuing adventure!');

      const currentLocation = battleState.locations[battleState.currentLocationIndex]!;
      const originalLocationIndex = battleState.currentLocationIndex;
      battleState.locations[battleState.currentLocationIndex]!.defeated++;

      const enemiesRemaining = currentLocation.enemies.length - battleState.locations[battleState.currentLocationIndex]!.defeated;

      if (enemiesRemaining > 0) {
        addToBattleLog(`${enemiesRemaining} enemies remaining in ${currentLocation.name}`);
      } else {
        addToBattleLog(`${currentLocation.name} cleared!`);
        battleState.locationSelectionPhase = true;
        addToBattleLog('Choose your next location!');
        broadcastState();
        return;
      }

      const countdownInterval = setInterval(() => {
        console.log(`Countdown: ${battleState.countdown}`);
        battleState.countdown--;
        if (battleState.countdown <= 0) {
          console.log('Countdown finished, getting next enemy');
          clearInterval(countdownInterval);
          battleState.waitingForNext = false;

          const nextEnemy = getNextEnemy();
          if (nextEnemy) {
            battleState.enemy = { ...nextEnemy };
            battleState.enemyImageUrl = generateEnemyImageUrl(nextEnemy.name, battleState.locations[battleState.currentLocationIndex]!.name, nextEnemy.abilities);
            battleState.isPlayerTurn = true;
            if (battleState.currentLocationIndex !== originalLocationIndex) {
              addToBattleLog(`Entered ${battleState.locations[battleState.currentLocationIndex]!.name}!`);
            }
            addToBattleLog(`A wild ${nextEnemy.name} appears in ${battleState.locations[battleState.currentLocationIndex]!.name}!`);
            startEnemyAttack();
          } else {
            addToBattleLog('All locations completed! You are victorious!');
          }
        }
        broadcastState();
      }, 1000);

      broadcastState();
      return;
    }
  } else {
    // Handle loot item
    const loot = item;
    const index = battleState.availableLoot.findIndex(l => l.name === loot.name && l.rarity === loot.rarity);
    if (index > -1) {
      battleState.availableLoot.splice(index, 1);
      addToBattleLog(`You picked up ${loot.rarity} ${loot.name}!`);

      // Apply item effects
      if (loot.name.includes('Sword')) {
        battleState.player.equipment.weapon = `${loot.rarity} ${loot.name}`;
        battleState.player.attack += 2;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Attack increased by 2!`);
      } else if (loot.name.includes('Bow')) {
        battleState.player.equipment.weapon = `${loot.rarity} ${loot.name}`;
        battleState.player.attack += 3;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Attack increased by 3!`);
      } else if (loot.name.includes('Dagger')) {
        battleState.player.equipment.weapon = `${loot.rarity} ${loot.name}`;
        battleState.player.attack += 2;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Attack increased by 2!`);
      } else if (loot.name.includes('Shield')) {
        battleState.player.equipment.shield = `${loot.rarity} ${loot.name}`;
        battleState.player.defense += 2;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Defense increased by 2!`);
      } else if (loot.name.includes('Armor')) {
        battleState.player.equipment.armor = `${loot.rarity} ${loot.name}`;
        battleState.player.maxHp += 20;
        battleState.player.hp += 20;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Max HP increased by 20!`);
      } else if (loot.name.includes('Helmet')) {
        battleState.player.equipment.helmet = `${loot.rarity} ${loot.name}`;
        battleState.player.defense += 1;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Defense increased by 1!`);
      } else if (loot.name.includes('Boots')) {
        battleState.player.equipment.boots = `${loot.rarity} ${loot.name}`;
        battleState.player.defense += 1;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Defense increased by 1!`);
      } else if (loot.name.includes('Ring')) {
        battleState.player.equipment.ring = `${loot.rarity} ${loot.name}`;
        battleState.player.attack += 1;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Attack increased by 1!`);
      } else if (loot.name.includes('Amulet')) {
        battleState.player.equipment.amulet = `${loot.rarity} ${loot.name}`;
        battleState.player.defense += 1;
        addToBattleLog(`Equipped ${loot.rarity} ${loot.name}! Defense increased by 1!`);
      } else if (loot.name.includes('Scroll')) {
        battleState.player.inventory.push(loot);
        battleState.player.attack += 3;
        addToBattleLog(`Used ${loot.rarity} ${loot.name}! Attack increased by 3!`);
      }

      battleState.lootPhase = false;
      battleState.waitingForNext = true;
      battleState.countdown = 1;
      addToBattleLog('Continuing adventure!');

      const currentLocation = battleState.locations[battleState.currentLocationIndex]!;
      const originalLocationIndex = battleState.currentLocationIndex;
      battleState.locations[battleState.currentLocationIndex]!.defeated++;

      const enemiesRemaining = currentLocation.enemies.length - battleState.locations[battleState.currentLocationIndex]!.defeated;

      if (enemiesRemaining > 0) {
        addToBattleLog(`${enemiesRemaining} enemies remaining in ${currentLocation.name}`);
      } else {
        addToBattleLog(`${currentLocation.name} cleared!`);
        battleState.locationSelectionPhase = true;
        addToBattleLog('Choose your next location!');
        broadcastState();
        return;
      }

      const countdownInterval = setInterval(() => {
        console.log(`Countdown: ${battleState.countdown}`);
        battleState.countdown--;
        if (battleState.countdown <= 0) {
          console.log('Countdown finished, getting next enemy');
          clearInterval(countdownInterval);
          battleState.waitingForNext = false;

          const nextEnemy = getNextEnemy();
          if (nextEnemy) {
            battleState.enemy = { ...nextEnemy };
            battleState.enemyImageUrl = generateEnemyImageUrl(nextEnemy.name, battleState.locations[battleState.currentLocationIndex]!.name, nextEnemy.abilities);
            battleState.isPlayerTurn = true;
            if (battleState.currentLocationIndex !== originalLocationIndex) {
              addToBattleLog(`Entered ${battleState.locations[battleState.currentLocationIndex]!.name}!`);
            }
            addToBattleLog(`A wild ${nextEnemy.name} appears in ${battleState.locations[battleState.currentLocationIndex]!.name}!`);
            startEnemyAttack();
          } else {
            addToBattleLog('All locations completed! You are victorious!');
          }
        }
        broadcastState();
      }, 1000);

      broadcastState();
    }
  }
}

function selectLocation(locationIndex: number) {
  if (!battleState.locationSelectionPhase) return;

  const currentLocation = battleState.locations[battleState.currentLocationIndex]!;
  if (!currentLocation.connections.includes(locationIndex)) {
    addToBattleLog('Cannot travel to that location!');
    return;
  }

  battleState.currentLocationIndex = locationIndex;
  battleState.locationSelectionPhase = false;
  // Always spawn the first enemy with full HP when entering a location
  const location = battleState.locations[locationIndex]!;
  if (location.enemies.length === 0) {
    addToBattleLog('No enemies in this location!');
    return;
  }
  const enemyTemplate = location.enemies[0]!;
  battleState.enemy = {
    name: enemyTemplate.name,
    hp: enemyTemplate.maxHp,
    maxHp: enemyTemplate.maxHp,
    attack: enemyTemplate.attack,
    defense: enemyTemplate.defense,
    abilities: enemyTemplate.abilities.map(ability => ({ ...ability, currentCooldown: 0 }))
  };
  battleState.enemyImageUrl = generateEnemyImageUrl(battleState.enemy.name, location.name, battleState.enemy.abilities);
  battleState.isPlayerTurn = true;
  battleState.waitingForNext = false;
  addToBattleLog(`Entered ${location.name}!`);
  addToBattleLog(`A wild ${battleState.enemy.name} appears!`);
  startEnemyAttack();
  broadcastState();
}

function resetBattle() {
  // Create fresh enemies with full HP
  const freshLocations: Location[] = [
    {
      name: 'Forest',
      enemies: [
        { 
          name: 'Goblin', 
          hp: 50, 
          maxHp: 50, 
          attack: 10, 
          defense: 2,
          abilities: [
            { name: 'Quick Strike', description: 'Fast attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 5 }
          ]
        },
        { 
          name: 'Forest Spider', 
          hp: 35, 
          maxHp: 35, 
          attack: 8, 
          defense: 1,
          abilities: [
            { name: 'Poison Bite', description: 'Poison damage over time', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 3 }
          ]
        },
        { 
          name: 'Wolf', 
          hp: 45, 
          maxHp: 45, 
          attack: 12, 
          defense: 3,
          abilities: [
            { name: 'Pack Howl', description: 'Increases attack', cooldown: 5, currentCooldown: 0, type: 'buff', effect: 3 }
          ]
        },
        { 
          name: 'Treant', 
          hp: 80, 
          maxHp: 80, 
          attack: 15, 
          defense: 8,
          abilities: [
            { name: 'Root Bind', description: 'Stuns player', cooldown: 6, currentCooldown: 0, type: 'special' },
            { name: 'Nature Heal', description: 'Heals itself', cooldown: 4, currentCooldown: 0, type: 'heal', effect: 15 }
          ]
        },
        { 
          name: 'Forest Sprite', 
          hp: 30, 
          maxHp: 30, 
          attack: 6, 
          defense: 1,
          abilities: [
            { name: 'Healing Dust', description: 'Heals allies', cooldown: 3, currentCooldown: 0, type: 'heal', effect: 10 }
          ]
        }
      ],
      defeated: 0,
      connections: [1, 2, 5]
    },
    {
      name: 'Cave',
      enemies: [
        { 
          name: 'Bat', 
          hp: 40, 
          maxHp: 40, 
          attack: 8, 
          defense: 1,
          abilities: [
            { name: 'Echolocation', description: 'Increases accuracy', cooldown: 4, currentCooldown: 0, type: 'buff', effect: 2 }
          ]
        },
        { 
          name: 'Cave Troll', 
          hp: 120, 
          maxHp: 120, 
          attack: 18, 
          defense: 6,
          abilities: [
            { name: 'Club Smash', description: 'Heavy damage', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 10 },
            { name: 'Rage', description: 'Berserk mode', cooldown: 8, currentCooldown: 0, type: 'buff', effect: 5 }
          ]
        },
        { 
          name: 'Slime', 
          hp: 60, 
          maxHp: 60, 
          attack: 7, 
          defense: 4,
          abilities: [
            { name: 'Acid Spit', description: 'Corrosive damage', cooldown: 3, currentCooldown: 0, type: 'debuff', effect: 4 },
            { name: 'Split', description: 'Duplicates when low health', cooldown: 10, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Golem', 
          hp: 100, 
          maxHp: 100, 
          attack: 14, 
          defense: 10,
          abilities: [
            { name: 'Stone Skin', description: 'Increases defense', cooldown: 5, currentCooldown: 0, type: 'buff', effect: 3 }
          ]
        },
        { 
          name: 'Shadow Lurker', 
          hp: 55, 
          maxHp: 55, 
          attack: 16, 
          defense: 2,
          abilities: [
            { name: 'Shadow Strike', description: 'Attack from shadows', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 8 },
            { name: 'Vanish', description: 'Become invisible', cooldown: 6, currentCooldown: 0, type: 'special' }
          ]
        }
      ],
      defeated: 0,
      connections: [0, 3, 6]
    },
    {
      name: 'Swamp',
      enemies: [
        { 
          name: 'Crocodile', 
          hp: 70, 
          maxHp: 70, 
          attack: 14, 
          defense: 5,
          abilities: [
            { name: 'Death Roll', description: 'Powerful bite', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 12 }
          ]
        },
        { 
          name: 'Will-o-Wisp', 
          hp: 25, 
          maxHp: 25, 
          attack: 10, 
          defense: 0,
          abilities: [
            { name: 'Confuse', description: 'Confuses player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 2 },
            { name: 'Teleport', description: 'Random movement', cooldown: 3, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Swamp Hag', 
          hp: 65, 
          maxHp: 65, 
          attack: 12, 
          defense: 3,
          abilities: [
            { name: 'Curse', description: 'Weakens player', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 3 },
            { name: 'Voodoo Doll', description: 'Reflects damage', cooldown: 7, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Giant Frog', 
          hp: 50, 
          maxHp: 50, 
          attack: 11, 
          defense: 4,
          abilities: [
            { name: 'Tongue Grab', description: 'Pulls player close', cooldown: 3, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Moss Golem', 
          hp: 90, 
          maxHp: 90, 
          attack: 13, 
          defense: 7,
          abilities: [
            { name: 'Regenerate', description: 'Heals over time', cooldown: 5, currentCooldown: 0, type: 'heal', effect: 8 },
            { name: 'Spore Cloud', description: 'Poisons area', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 5 }
          ]
        }
      ],
      defeated: 0,
      connections: [0, 4, 7]
    },
    {
      name: 'Desert',
      enemies: [
        { 
          name: 'Scorpion', 
          hp: 45, 
          maxHp: 45, 
          attack: 11, 
          defense: 2,
          abilities: [
            { name: 'Venom Sting', description: 'Poison attack', cooldown: 3, currentCooldown: 0, type: 'debuff', effect: 4 }
          ]
        },
        { 
          name: 'Vulture', 
          hp: 35, 
          maxHp: 35, 
          attack: 9, 
          defense: 1,
          abilities: [
            { name: 'Dive Bomb', description: 'Aerial attack', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 7 }
          ]
        },
        { 
          name: 'Sand Worm', 
          hp: 95, 
          maxHp: 95, 
          attack: 17, 
          defense: 6,
          abilities: [
            { name: 'Swallow', description: 'Deals heavy damage', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 15 },
            { name: 'Burrow', description: 'Underground attack', cooldown: 4, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Desert Nomad', 
          hp: 60, 
          maxHp: 60, 
          attack: 14, 
          defense: 4,
          abilities: [
            { name: 'Sand Storm', description: 'Blinds player', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 3 },
            { name: 'Camouflage', description: 'Hides in sand', cooldown: 5, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Mummy', 
          hp: 80, 
          maxHp: 80, 
          attack: 13, 
          defense: 5,
          abilities: [
            { name: 'Curse Touch', description: 'Weakens player', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 4 },
            { name: 'Bandage Wrap', description: 'Heals itself', cooldown: 5, currentCooldown: 0, type: 'heal', effect: 12 }
          ]
        }
      ],
      defeated: 0,
      connections: [2, 5, 8]
    },
    {
      name: 'Mountain',
      enemies: [
        { 
          name: 'Eagle', 
          hp: 38, 
          maxHp: 38, 
          attack: 10, 
          defense: 1,
          abilities: [
            { name: 'Talons', description: 'Sharp attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 6 }
          ]
        },
        { 
          name: 'Yeti', 
          hp: 85, 
          maxHp: 85, 
          attack: 16, 
          defense: 5,
          abilities: [
            { name: 'Ice Breath', description: 'Freezes player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 5 },
            { name: 'Roar', description: 'Scares player', cooldown: 6, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Giant', 
          hp: 110, 
          maxHp: 110, 
          attack: 22, 
          defense: 9,
          abilities: [
            { name: 'Rock Throw', description: 'Long range attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 10 },
            { name: 'Stomp', description: 'Area damage', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 8 }
          ]
        },
        { 
          name: 'Mountain Lion', 
          hp: 55, 
          maxHp: 55, 
          attack: 15, 
          defense: 3,
          abilities: [
            { name: 'Pounce', description: 'Leaping attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 9 }
          ]
        },
        { 
          name: 'Harpy', 
          hp: 45, 
          maxHp: 45, 
          attack: 13, 
          defense: 2,
          abilities: [
            { name: 'Siren Song', description: 'Charms player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 4 },
            { name: 'Wind Gust', description: 'Pushes player back', cooldown: 4, currentCooldown: 0, type: 'special' }
          ]
        }
      ],
      defeated: 0,
      connections: [0, 4, 9]
    },
    {
      name: 'Castle',
      enemies: [
        { 
          name: 'Skeleton', 
          hp: 55, 
          maxHp: 55, 
          attack: 13, 
          defense: 4,
          abilities: [
            { name: 'Bone Throw', description: 'Ranged attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 6 }
          ]
        },
        { 
          name: 'Dark Knight', 
          hp: 100, 
          maxHp: 100, 
          attack: 20, 
          defense: 8,
          abilities: [
            { name: 'Shield Bash', description: 'Stuns player', cooldown: 4, currentCooldown: 0, type: 'special' },
            { name: 'Holy Strike', description: 'Light damage', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 12 }
          ]
        },
        { 
          name: 'Lich', 
          hp: 120, 
          maxHp: 120, 
          attack: 25, 
          defense: 6,
          abilities: [
            { name: 'Life Drain', description: 'Steals health', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 },
            { name: 'Raise Dead', description: 'Summons minions', cooldown: 8, currentCooldown: 0, type: 'special' },
            { name: 'Ice Bolt', description: 'Magic attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 10 }
          ]
        },
        { 
          name: 'Dragon', 
          hp: 150, 
          maxHp: 150, 
          attack: 30, 
          defense: 10,
          abilities: [
            { name: 'Fire Breath', description: 'Burns area', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 20 },
            { name: 'Tail Sweep', description: 'Area attack', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 },
            { name: 'Wing Gust', description: 'Wind attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 10 }
          ]
        },
        { 
          name: 'Castle Guard', 
          hp: 75, 
          maxHp: 75, 
          attack: 16, 
          defense: 7,
          abilities: [
            { name: 'Formation', description: 'Defense boost', cooldown: 5, currentCooldown: 0, type: 'buff', effect: 3 }
          ]
        }
      ],
      defeated: 0,
      connections: [1, 7, 10]
    },
    {
      name: 'Volcano',
      enemies: [
        { 
          name: 'Fire Elemental', 
          hp: 65, 
          maxHp: 65, 
          attack: 18, 
          defense: 3,
          abilities: [
            { name: 'Inferno', description: 'Burns player', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 14 },
            { name: 'Fire Shield', description: 'Burns attackers', cooldown: 6, currentCooldown: 0, type: 'buff', effect: 5 }
          ]
        },
        { 
          name: 'Lava Golem', 
          hp: 130, 
          maxHp: 130, 
          attack: 20, 
          defense: 12,
          abilities: [
            { name: 'Lava Spit', description: 'Melts armor', cooldown: 3, currentCooldown: 0, type: 'debuff', effect: 6 },
            { name: 'Magma Form', description: 'Immune to damage', cooldown: 8, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Phoenix', 
          hp: 90, 
          maxHp: 90, 
          attack: 22, 
          defense: 5,
          abilities: [
            { name: 'Rebirth', description: 'Revives once', cooldown: 10, currentCooldown: 0, type: 'special' },
            { name: 'Flame Wing', description: 'Fire attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 12 }
          ]
        },
        { 
          name: 'Imp', 
          hp: 30, 
          maxHp: 30, 
          attack: 12, 
          defense: 2,
          abilities: [
            { name: 'Hellfire', description: 'Small fire attack', cooldown: 2, currentCooldown: 0, type: 'damage', effect: 8 }
          ]
        },
        { 
          name: 'Molten Beast', 
          hp: 100, 
          maxHp: 100, 
          attack: 19, 
          defense: 8,
          abilities: [
            { name: 'Melt Armor', description: 'Reduces defense', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 4 },
            { name: 'Eruption', description: 'Explosive attack', cooldown: 6, currentCooldown: 0, type: 'damage', effect: 18 }
          ]
        }
      ],
      defeated: 0,
      connections: [2, 6, 11]
    },
    {
      name: 'Tundra',
      enemies: [
        { 
          name: 'Ice Wolf', 
          hp: 50, 
          maxHp: 50, 
          attack: 14, 
          defense: 4,
          abilities: [
            { name: 'Frost Bite', description: 'Slows player', cooldown: 3, currentCooldown: 0, type: 'debuff', effect: 5 }
          ]
        },
        { 
          name: 'Frost Giant', 
          hp: 140, 
          maxHp: 140, 
          attack: 24, 
          defense: 11,
          abilities: [
            { name: 'Ice Hammer', description: 'Freezes player', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 16 },
            { name: 'Blizzard', description: 'Area slow', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 6 }
          ]
        },
        { 
          name: 'Snow Leopard', 
          hp: 60, 
          maxHp: 60, 
          attack: 17, 
          defense: 3,
          abilities: [
            { name: 'Pounce', description: 'Quick attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 11 }
          ]
        },
        { 
          name: 'Ice Elemental', 
          hp: 70, 
          maxHp: 70, 
          attack: 16, 
          defense: 6,
          abilities: [
            { name: 'Ice Shard', description: 'Sharp ice attack', cooldown: 2, currentCooldown: 0, type: 'damage', effect: 9 },
            { name: 'Freeze', description: 'Stuns player', cooldown: 5, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Polar Bear', 
          hp: 95, 
          maxHp: 95, 
          attack: 19, 
          defense: 7,
          abilities: [
            { name: 'Maul', description: 'Heavy attack', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 14 }
          ]
        }
      ],
      defeated: 0,
      connections: [3, 8, 12]
    },
    {
      name: 'Ocean',
      enemies: [
        { 
          name: 'Shark', 
          hp: 75, 
          maxHp: 75, 
          attack: 18, 
          defense: 5,
          abilities: [
            { name: 'Blood Frenzy', description: 'Berserk when wounded', cooldown: 4, currentCooldown: 0, type: 'buff', effect: 4 }
          ]
        },
        { 
          name: 'Kraken', 
          hp: 160, 
          maxHp: 160, 
          attack: 28, 
          defense: 9,
          abilities: [
            { name: 'Tentacle Grab', description: 'Holds player', cooldown: 3, currentCooldown: 0, type: 'special' },
            { name: 'Ink Cloud', description: 'Blinds player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 5 },
            { name: 'Whirlpool', description: 'Area damage', cooldown: 7, currentCooldown: 0, type: 'damage', effect: 20 }
          ]
        },
        { 
          name: 'Mermaid', 
          hp: 55, 
          maxHp: 55, 
          attack: 15, 
          defense: 4,
          abilities: [
            { name: 'Siren Call', description: 'Charms player', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 4 },
            { name: 'Healing Waters', description: 'Heals itself', cooldown: 5, currentCooldown: 0, type: 'heal', effect: 15 }
          ]
        },
        { 
          name: 'Sea Serpent', 
          hp: 120, 
          maxHp: 120, 
          attack: 23, 
          defense: 7,
          abilities: [
            { name: 'Constrict', description: 'Crushing hold', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 },
            { name: 'Tidal Wave', description: 'Water attack', cooldown: 6, currentCooldown: 0, type: 'damage', effect: 18 }
          ]
        },
        { 
          name: 'Pirate Ghost', 
          hp: 65, 
          maxHp: 65, 
          attack: 17, 
          defense: 3,
          abilities: [
            { name: 'Ghostly Curse', description: 'Weakens player', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 5 },
            { name: 'Phase Shift', description: 'Intangible', cooldown: 6, currentCooldown: 0, type: 'special' }
          ]
        }
      ],
      defeated: 0,
      connections: [4, 7, 9]
    },
    {
      name: 'Sky Realm',
      enemies: [
        { 
          name: 'Thunderbird', 
          hp: 80, 
          maxHp: 80, 
          attack: 20, 
          defense: 4,
          abilities: [
            { name: 'Lightning Strike', description: 'Electric attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 14 },
            { name: 'Thunder Clap', description: 'Stuns player', cooldown: 5, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Cloud Giant', 
          hp: 135, 
          maxHp: 135, 
          attack: 26, 
          defense: 10,
          abilities: [
            { name: 'Wind Punch', description: 'Air blast', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 12 },
            { name: 'Cloud Form', description: 'Evades attacks', cooldown: 6, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Storm Elemental', 
          hp: 90, 
          maxHp: 90, 
          attack: 22, 
          defense: 6,
          abilities: [
            { name: 'Chain Lightning', description: 'Multiple hits', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 16 },
            { name: 'Cyclone', description: 'Area damage', cooldown: 6, currentCooldown: 0, type: 'damage', effect: 18 }
          ]
        },
        { 
          name: 'Angel', 
          hp: 100, 
          maxHp: 100, 
          attack: 21, 
          defense: 8,
          abilities: [
            { name: 'Holy Light', description: 'Divine damage', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 },
            { name: 'Divine Heal', description: 'Full heal', cooldown: 8, currentCooldown: 0, type: 'heal', effect: 50 }
          ]
        },
        { 
          name: 'Roc', 
          hp: 110, 
          maxHp: 110, 
          attack: 24, 
          defense: 7,
          abilities: [
            { name: 'Talons', description: 'Sharp attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 13 },
            { name: 'Wind Dive', description: 'Aerial assault', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 16 }
          ]
        }
      ],
      defeated: 0,
      connections: [5, 8, 10]
    },
    {
      name: 'Abyss',
      enemies: [
        { 
          name: 'Demon', 
          hp: 95, 
          maxHp: 95, 
          attack: 25, 
          defense: 6,
          abilities: [
            { name: 'Hellfire', description: 'Burns soul', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 18 },
            { name: 'Soul Drain', description: 'Steals life', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 15 }
          ]
        },
        { 
          name: 'Devil', 
          hp: 150, 
          maxHp: 150, 
          attack: 32, 
          defense: 12,
          abilities: [
            { name: 'Contract', description: 'Curses player', cooldown: 5, currentCooldown: 0, type: 'debuff', effect: 8 },
            { name: 'Hell Portal', description: 'Summons demons', cooldown: 8, currentCooldown: 0, type: 'special' },
            { name: 'Darkness', description: 'Blinds all', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 6 }
          ]
        },
        { 
          name: 'Shadow Beast', 
          hp: 110, 
          maxHp: 110, 
          attack: 27, 
          defense: 8,
          abilities: [
            { name: 'Shadow Claw', description: 'Dark damage', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 16 },
            { name: 'Phase Shift', description: 'Teleports', cooldown: 4, currentCooldown: 0, type: 'special' }
          ]
        },
        { 
          name: 'Chaos Dragon', 
          hp: 200, 
          maxHp: 200, 
          attack: 35, 
          defense: 15,
          abilities: [
            { name: 'Chaos Breath', description: 'Random effect', cooldown: 4, currentCooldown: 0, type: 'damage', effect: 25 },
            { name: 'Reality Warp', description: 'Changes battlefield', cooldown: 7, currentCooldown: 0, type: 'special' },
            { name: 'Destroy', description: 'Ultimate attack', cooldown: 10, currentCooldown: 0, type: 'damage', effect: 40 }
          ]
        },
        { 
          name: 'Void Walker', 
          hp: 85, 
          maxHp: 85, 
          attack: 23, 
          defense: 7,
          abilities: [
            { name: 'Void Touch', description: 'Erases defense', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 7 },
            { name: 'Dimension Rift', description: 'Space attack', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 19 }
          ]
        }
      ],
      defeated: 0,
      connections: [6, 9]
    }
  ];

  const initialEnemy = freshLocations[0]!.enemies[0]!;

  battleState = {
    player: {
      name: 'Hero',
      hp: 100,
      maxHp: 100,
      attack: 15,
      defense: 5,
      equipment: {},
      inventory: [] as LootItem[]
    },
    enemy: initialEnemy,
    enemyImageUrl: generateEnemyImageUrl(initialEnemy.name, freshLocations[0]!.name, initialEnemy.abilities),
    battleLog: [`A wild ${initialEnemy.name} appears!`],
    isPlayerTurn: true,
    lootPhase: false,
    availableLoot: [],
    currentLocationIndex: 0,
    locations: freshLocations,
    waitingForNext: false,
    countdown: 0,
    locationSelectionPhase: false
  };

  console.log('Reset battle - enemy HP:', battleState.enemy.hp);
  broadcastState();

  // Force restart enemy attacks after a short delay to ensure state is properly set
  setTimeout(() => {
    console.log('Restarting enemy attacks - enemy HP:', battleState.enemy.hp);
    stopEnemyAttack();
    startEnemyAttack();
  }, 100);
}

const server = Bun.serve({
  port: 7879,
  routes: {
    "/*": index,
  },
  fetch(req, server) {
    const url = new URL(req.url);

    // Handle WebSocket upgrade
    if (url.pathname === '/ws') {
      const upgraded = server.upgrade(req);
      if (upgraded) return undefined;
    }

    return new Response('Not found', { status: 404 });
  },
  websocket: {
    open(ws) {
      clients.add(ws);
      ws.send(JSON.stringify({ type: 'state', data: battleState }));
      console.log('Client connected');
    },
    message(ws, message) {
      try {
        const data = JSON.parse(message.toString()) as { action: string; item?: string; locationIndex?: number };

        switch (data.action) {
          case 'attack':
            playerAttack();
            break;
          case 'heal':
            playerHeal();
            break;
          case 'reset':
            resetBattle();
            break;
          case 'pickLoot':
            if (data.item) pickLoot(data.item);
            break;
          case 'selectLocation':
            if (data.locationIndex !== undefined) selectLocation(data.locationIndex);
            break;
        }
      } catch (error) {
        console.error('Invalid message:', error);
      }
    },
    close(ws) {
      clients.delete(ws);
      console.log('Client disconnected');
    }
  },
  development: {
    hmr: true,
    console: true,
  }
});

console.log(`Server running at http://localhost:${server.port}`);
