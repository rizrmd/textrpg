import type { BattleState, Enemy, Location, LootItem, EnemyAbility } from '../types/game';

// Game data - locations and enemies
export const locations: Location[] = [
  {
    name: 'Whispering Woods',
    enemies: [
      {
        name: 'Goblin Scout',
        hp: 45,
        maxHp: 45,
        attack: 8,
        defense: 2,
        minLevel: 1,
        maxLevel: 3,
        experienceValue: 25,
        abilities: [
          { name: 'Quick Strike', description: 'Fast attack', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 4 }
        ]
      },
      {
        name: 'Venomous Spider',
        hp: 35,
        maxHp: 35,
        attack: 7,
        defense: 1,
        minLevel: 2,
        maxLevel: 5,
        experienceValue: 35,
        abilities: [
          { name: 'Poison Bite', description: 'Poison damage over time', cooldown: 4, currentCooldown: 0, type: 'debuff', effect: 3 }
        ]
      }
    ],
    defeated: 0,
    connections: [1, 2] // Connects to Crystal Caverns and Ancient Ruins
  },
  {
    name: 'Crystal Caverns',
    enemies: [
      {
        name: 'Crystal Bat',
        hp: 40,
        maxHp: 40,
        attack: 9,
        defense: 1,
        minLevel: 3,
        maxLevel: 7,
        experienceValue: 45,
        abilities: [
          { name: 'Crystal Echo', description: 'Increases accuracy', cooldown: 4, currentCooldown: 0, type: 'buff', effect: 2 }
        ]
      },
      {
        name: 'Stone Guardian',
        hp: 110,
        maxHp: 110,
        attack: 16,
        defense: 8,
        minLevel: 5,
        maxLevel: 10,
        experienceValue: 75,
        abilities: [
          { name: 'Boulder Crush', description: 'Heavy damage', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 12 },
          { name: 'Stone Skin', description: 'Defense boost', cooldown: 6, currentCooldown: 0, type: 'buff', effect: 4 }
        ]
      }
    ],
    defeated: 0,
    connections: [0, 3] // Connects back to Whispering Woods, forward to Misty Mountains
  },
  {
    name: 'Ancient Ruins',
    enemies: [
      {
        name: 'Skeletal Warrior',
        hp: 55,
        maxHp: 55,
        attack: 12,
        defense: 4,
        minLevel: 4,
        maxLevel: 8,
        experienceValue: 55,
        abilities: [
          { name: 'Bone Strike', description: 'Piercing attack', cooldown: 2, currentCooldown: 0, type: 'damage', effect: 8 }
        ]
      },
      {
        name: 'Ancient Wraith',
        hp: 70,
        maxHp: 70,
        attack: 14,
        defense: 3,
        minLevel: 6,
        maxLevel: 12,
        experienceValue: 85,
        abilities: [
          { name: 'Soul Drain', description: 'Drains life force', cooldown: 5, currentCooldown: 0, type: 'special', effect: 10 },
          { name: 'Phase Shift', description: 'Temporary invulnerability', cooldown: 7, currentCooldown: 0, type: 'buff', effect: 1 }
        ]
      }
    ],
    defeated: 0,
    connections: [0, 4] // Connects back to Whispering Woods, forward to Forgotten Swamp
  },
  {
    name: 'Misty Mountains',
    enemies: [
      {
        name: 'Mountain Goat',
        hp: 60,
        maxHp: 60,
        attack: 11,
        defense: 5,
        minLevel: 7,
        maxLevel: 12,
        experienceValue: 65,
        abilities: [
          { name: 'Headbutt', description: 'Powerful charge', cooldown: 3, currentCooldown: 0, type: 'damage', effect: 15 }
        ]
      },
      {
        name: 'Frost Giant',
        hp: 150,
        maxHp: 150,
        attack: 20,
        defense: 10,
        minLevel: 10,
        maxLevel: 15,
        experienceValue: 100,
        abilities: [
          { name: 'Avalanche', description: 'Massive area damage', cooldown: 5, currentCooldown: 0, type: 'damage', effect: 25 },
          { name: 'Ice Armor', description: 'Heavy defense boost', cooldown: 8, currentCooldown: 0, type: 'buff', effect: 6 }
        ]
      }
    ],
    defeated: 0,
    connections: [1] // One-way from Crystal Caverns (mountain path)
  },
  {
    name: 'Forgotten Swamp',
    enemies: [
      {
        name: 'Swamp Leech',
        hp: 30,
        maxHp: 30,
        attack: 6,
        defense: 1,
        minLevel: 8,
        maxLevel: 14,
        experienceValue: 70,
        abilities: [
          { name: 'Blood Drain', description: 'Life-stealing attack', cooldown: 4, currentCooldown: 0, type: 'special', effect: 8 }
        ]
      },
      {
        name: 'Swamp Horror',
        hp: 130,
        maxHp: 130,
        attack: 18,
        defense: 7,
        minLevel: 12,
        maxLevel: 18,
        experienceValue: 120,
        abilities: [
          { name: 'Toxic Cloud', description: 'Area poison damage', cooldown: 6, currentCooldown: 0, type: 'debuff', effect: 5 },
          { name: 'Regeneration', description: 'Heals over time', cooldown: 4, currentCooldown: 0, type: 'heal', effect: 15 }
        ]
      }
    ],
    defeated: 0,
    connections: [2] // One-way from Ancient Ruins (mysterious path)
  }
];

// Utility functions
export function generateLoot(battleState: BattleState): LootItem[] {
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)]!;
  const itemTypes = ['Sword', 'Shield', 'Armor', 'Scroll', 'Bow', 'Dagger', 'Helmet', 'Boots', 'Ring', 'Amulet'];
  const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)]!;
  const itemName = `${battleState.enemy.name} ${itemType}`;
  return [{ name: itemName, rarity }];
}

export function generateEnemyImageUrl(enemyName: string, locationName: string, abilities?: EnemyAbility[]): string {
  const itemTypes = ['Sword', 'Shield', 'Armor', 'Scroll', 'Bow', 'Dagger', 'Helmet', 'Boots', 'Ring', 'Amulet'];
  const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)]!;
  const itemName = `${enemyName} ${itemType}`;

  let abilityDescription = '';
  if (abilities && abilities.length > 0) {
    const primaryAbility = abilities[0];
    if (primaryAbility) {
      if (primaryAbility.type === 'damage' && primaryAbility.name.includes('Fire')) {
        abilityDescription = 'with glowing fire effects and flames';
      } else if (primaryAbility.type === 'damage' && primaryAbility.name.includes('Ice')) {
        abilityDescription = 'with icy blue aura and frost effects';
      } else if (primaryAbility.type === 'heal') {
        abilityDescription = 'with green healing aura and magical energy';
      } else {
        abilityDescription = 'with magical energy and special effects';
      }
    }
  }

  const prompt = `A fierce ${enemyName} in the ${locationName}, fantasy art style, facing forward in a ready to attack stance ${abilityDescription}, carrying or wearing a ${itemType}, the enemy will drop ${itemName} when defeated`;
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://pollinations.ai/p/${encodedPrompt}?width=900&height=660&nologo=true`;
}

export function addToBattleLog(battleState: BattleState, message: string): void {
  battleState.battleLog = [...battleState.battleLog.slice(-4), message];
}

export function createInitialBattleState(): BattleState {
  const initialEnemy = locations[0]!.enemies[0]!;
  return {
    player: {
      name: 'Hero',
      hp: 100,
      maxHp: 100,
      attack: 15,
      defense: 5,
      level: 1,
      experience: 0,
      currentLocationIndex: 0,
      equipment: {},
      inventory: [
        { name: 'Health Potion', rarity: 'Common' },
        { name: 'Health Potion', rarity: 'Common' },
        { name: 'Health Potion', rarity: 'Common' }
      ]
    },
    enemy: initialEnemy,
    enemyImageUrl: generateEnemyImageUrl(initialEnemy.name, locations[0]!.name, initialEnemy.abilities),
    battleLog: ['A wild Goblin Scout appears!'],
    lootPhase: false,
    availableLoot: [],
    locations: locations.map(loc => ({ ...loc, enemies: [...loc.enemies], connections: [...loc.connections] })),
    waitingForNext: false,
    countdown: 0,
    locationSelectionPhase: false,
    loadingEnemyImage: false
  };
}

// Game action functions
export function playerAttack(battleState: BattleState): void {
  if (battleState.player.hp <= 0 || battleState.enemy.hp <= 0 || battleState.lootPhase || battleState.waitingForNext) {
    return;
  }

  const damage = Math.max(1, battleState.player.attack - battleState.enemy.defense + Math.floor(Math.random() * 5));
  battleState.enemy.hp = Math.max(0, battleState.enemy.hp - damage);
  addToBattleLog(battleState, `${battleState.player.name} deals ${damage} damage to ${battleState.enemy.name}!`);

  if (battleState.enemy.hp <= 0) {
    addToBattleLog(battleState, `${battleState.enemy.name} has been defeated!`);

    // Award experience
    const expGained = battleState.enemy.experienceValue;
    battleState.player.experience += expGained;
    addToBattleLog(battleState, `Gained ${expGained} experience!`);

    // Check for level up
    const expNeeded = battleState.player.level * 100; // Simple formula: level * 100 exp needed
    if (battleState.player.experience >= expNeeded) {
      battleState.player.level += 1;
      battleState.player.experience -= expNeeded;

      // Level up bonuses
      battleState.player.maxHp += 10;
      battleState.player.hp = battleState.player.maxHp; // Full heal on level up
      battleState.player.attack += 2;
      battleState.player.defense += 1;

      addToBattleLog(battleState, `LEVEL UP! Now level ${battleState.player.level}!`);
      addToBattleLog(battleState, `HP +10, Attack +2, Defense +1`);
    }

    battleState.lootPhase = true;
    battleState.availableLoot = generateLoot(battleState);
    addToBattleLog(battleState, `${battleState.enemy.name} dropped items!`);
  }
}

export function playerHeal(battleState: BattleState): void {
  if (battleState.player.hp <= 0 || battleState.enemy.hp <= 0 || battleState.lootPhase || battleState.waitingForNext) {
    return;
  }

  // Check if player has a health potion
  const potionIndex = battleState.player.inventory.findIndex(item => item.name === 'Health Potion');
  if (potionIndex === -1) {
    addToBattleLog(battleState, 'No health potions available!');
    return;
  }

  // Remove one health potion from inventory
  battleState.player.inventory.splice(potionIndex, 1);

  const healAmount = 30;
  battleState.player.hp = Math.min(battleState.player.maxHp, battleState.player.hp + healAmount);
  addToBattleLog(battleState, `${battleState.player.name} uses a Health Potion and heals for ${healAmount} HP!`);
}

export function executeEnemyAbility(battleState: BattleState, ability: EnemyAbility): void {
  switch (ability.type) {
    case 'damage':
      const damage = Math.max(1, (ability.effect || 10) - battleState.player.defense + Math.floor(Math.random() * 3));
      battleState.player.hp = Math.max(0, battleState.player.hp - damage);
      addToBattleLog(battleState, `${battleState.enemy.name} uses ${ability.name}! Deals ${damage} damage!`);
      break;

    case 'heal':
      const healAmount = ability.effect || 15;
      const actualHeal = Math.min(battleState.enemy.maxHp - battleState.enemy.hp, healAmount);
      battleState.enemy.hp += actualHeal;
      addToBattleLog(battleState, `${battleState.enemy.name} uses ${ability.name}! Heals ${actualHeal} HP!`);
      break;

    case 'buff':
      addToBattleLog(battleState, `${battleState.enemy.name} uses ${ability.name}! Becomes stronger!`);
      battleState.enemy.attack += (ability.effect || 3);
      battleState.enemy.defense += Math.floor((ability.effect || 3) / 2);
      break;

    case 'debuff':
      addToBattleLog(battleState, `${battleState.enemy.name} uses ${ability.name}! Weakens ${battleState.player.name}!`);
      battleState.player.attack = Math.max(1, battleState.player.attack - (ability.effect || 3));
      battleState.player.defense = Math.max(0, battleState.player.defense - Math.floor((ability.effect || 3) / 2));
      break;

    case 'special':
      addToBattleLog(battleState, `${battleState.enemy.name} uses ${ability.name}! Special effect!`);
      if (ability.name.includes('Stun') || ability.name.includes('Freeze')) {
        addToBattleLog(battleState, `${battleState.player.name} is stunned!`);
      }
      break;
  }
}

export function getNextEnemy(battleState: BattleState): Enemy | null {
  const currentLocation = battleState.locations[battleState.player.currentLocationIndex];
  if (!currentLocation) return null;

  // Check if all enemies in current location are defeated
  if (currentLocation.defeated >= currentLocation.enemies.length) {
    // Move to next location
    if (battleState.player.currentLocationIndex < battleState.locations.length - 1) {
      battleState.player.currentLocationIndex++;
      const nextLocation = battleState.locations[battleState.player.currentLocationIndex];
      if (!nextLocation) return null;

      // If next location is also fully defeated, continue searching
      if (nextLocation.defeated >= nextLocation.enemies.length) {
        return getNextEnemy(battleState); // Recursively find next available enemy
      }

      const nextLocationEnemy = nextLocation.enemies[nextLocation.defeated];
      if (!nextLocationEnemy) return null;

      return {
        name: nextLocationEnemy.name,
        hp: nextLocationEnemy.maxHp, // Reset HP to max
        maxHp: nextLocationEnemy.maxHp,
        attack: nextLocationEnemy.attack,
        defense: nextLocationEnemy.defense,
        minLevel: nextLocationEnemy.minLevel,
        maxLevel: nextLocationEnemy.maxLevel,
        experienceValue: nextLocationEnemy.experienceValue,
        abilities: nextLocationEnemy.abilities.map(ability => ({ ...ability, currentCooldown: 0 }))
      };
    }

    // All locations completed
    return null;
  }

  // Get next enemy from current location
  const nextEnemy = currentLocation.enemies[currentLocation.defeated];
  if (!nextEnemy) return null;

  // Check if enemy is within player's level range
  if (battleState.player.level < nextEnemy.minLevel || battleState.player.level > nextEnemy.maxLevel) {
    // Skip this enemy and mark as defeated, then find next available enemy
    currentLocation.defeated++;
    return getNextEnemy(battleState);
  }

  return {
    name: nextEnemy.name,
    hp: nextEnemy.maxHp, // Reset HP to max
    maxHp: nextEnemy.maxHp,
    attack: nextEnemy.attack,
    defense: nextEnemy.defense,
    minLevel: nextEnemy.minLevel,
    maxLevel: nextEnemy.maxLevel,
    experienceValue: nextEnemy.experienceValue,
    abilities: nextEnemy.abilities.map(ability => ({ ...ability, currentCooldown: 0 }))
  };
}

export function selectLocation(battleState: BattleState, locationIndex: number): void {
  if (!battleState.locationSelectionPhase) return;

  const currentLocation = battleState.locations[battleState.player.currentLocationIndex];
  if (!currentLocation || !currentLocation.connections.includes(locationIndex)) {
    addToBattleLog(battleState, 'Cannot travel to that location!');
    return;
  }

  battleState.player.currentLocationIndex = locationIndex;
  battleState.locationSelectionPhase = false;

  // Find the first available enemy in this location that matches player's level
  const location = battleState.locations[locationIndex];
  if (!location || location.enemies.length === 0) {
    addToBattleLog(battleState, 'No enemies in this location!');
    return;
  }

  // Find first enemy that player can fight
  let enemyIndex = 0;
  let enemyTemplate = location.enemies[enemyIndex];
  while (enemyTemplate && (battleState.player.level < enemyTemplate.minLevel || battleState.player.level > enemyTemplate.maxLevel)) {
    enemyIndex++;
    enemyTemplate = location.enemies[enemyIndex];
  }

  if (!enemyTemplate) {
    addToBattleLog(battleState, 'No suitable enemies found in this location!');
    return;
  }

  // Mark enemies before this one as defeated (since player can't fight them)
  location.defeated = enemyIndex;

  battleState.enemy = {
    name: enemyTemplate.name,
    hp: enemyTemplate.maxHp,
    maxHp: enemyTemplate.maxHp,
    attack: enemyTemplate.attack,
    defense: enemyTemplate.defense,
    minLevel: enemyTemplate.minLevel,
    maxLevel: enemyTemplate.maxLevel,
    experienceValue: enemyTemplate.experienceValue,
    abilities: enemyTemplate.abilities.map(ability => ({ ...ability, currentCooldown: 0 }))
  };
   battleState.enemyImageUrl = generateEnemyImageUrl(battleState.enemy.name, location.name, battleState.enemy.abilities);
   battleState.waitingForNext = false;
  addToBattleLog(battleState, `Entered ${location.name}!`);
  addToBattleLog(battleState, `A wild ${battleState.enemy.name} appears!`);
}