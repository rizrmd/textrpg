import type { BattleState, LootItem } from '../types/game';
import { addToBattleLog } from './gameEngine';

export class LootManager {
  static generateLoot(battleState: BattleState): LootItem[] {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)]!;
    const itemTypes = ['Sword', 'Shield', 'Armor', 'Scroll', 'Bow', 'Dagger', 'Helmet', 'Boots', 'Ring', 'Amulet'];
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)]!;
    const itemName = `${battleState.enemy.name} ${itemType}`;
    return [{ name: itemName, rarity }];
  }

  static applyItemEffects(battleState: BattleState, loot: LootItem): void {
    if (loot.name.includes('Sword')) {
      battleState.player.equipment.weapon = `${loot.rarity} ${loot.name}`;
      battleState.player.attack += 2;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Attack increased by 2!`);
    } else if (loot.name.includes('Bow')) {
      battleState.player.equipment.weapon = `${loot.rarity} ${loot.name}`;
      battleState.player.attack += 3;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Attack increased by 3!`);
    } else if (loot.name.includes('Dagger')) {
      battleState.player.equipment.weapon = `${loot.rarity} ${loot.name}`;
      battleState.player.attack += 2;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Attack increased by 2!`);
    } else if (loot.name.includes('Shield')) {
      battleState.player.equipment.shield = `${loot.rarity} ${loot.name}`;
      battleState.player.defense += 2;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Defense increased by 2!`);
    } else if (loot.name.includes('Armor')) {
      battleState.player.equipment.armor = `${loot.rarity} ${loot.name}`;
      battleState.player.maxHp += 20;
      battleState.player.hp += 20;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Max HP increased by 20!`);
    } else if (loot.name.includes('Helmet')) {
      battleState.player.equipment.helmet = `${loot.rarity} ${loot.name}`;
      battleState.player.defense += 1;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Defense increased by 1!`);
    } else if (loot.name.includes('Boots')) {
      battleState.player.equipment.boots = `${loot.rarity} ${loot.name}`;
      battleState.player.defense += 1;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Defense increased by 1!`);
    } else if (loot.name.includes('Ring')) {
      battleState.player.equipment.ring = `${loot.rarity} ${loot.name}`;
      battleState.player.attack += 1;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Attack increased by 1!`);
    } else if (loot.name.includes('Amulet')) {
      battleState.player.equipment.amulet = `${loot.rarity} ${loot.name}`;
      battleState.player.defense += 1;
      addToBattleLog(battleState, `Equipped ${loot.rarity} ${loot.name}! Defense increased by 1!`);
    } else if (loot.name.includes('Scroll')) {
      battleState.player.inventory.push(loot);
      battleState.player.attack += 3;
      addToBattleLog(battleState, `Used ${loot.rarity} ${loot.name}! Attack increased by 3!`);
    }
  }
}