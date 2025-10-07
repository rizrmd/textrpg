// Game calculation utilities
export function calculateDamage(attackerAttack: number, defenderDefense: number): number {
  return Math.max(1, attackerAttack - defenderDefense + Math.floor(Math.random() * 5));
}

export function calculateHeal(currentHp: number, maxHp: number, healAmount: number): number {
  return Math.min(maxHp, currentHp + healAmount);
}

export function generateRandomRarity(): string {
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic'];
  return rarities[Math.floor(Math.random() * rarities.length)]!;
}

export function generateRandomItemType(): string {
  const itemTypes = ['Sword', 'Shield', 'Armor', 'Scroll', 'Bow', 'Dagger', 'Helmet', 'Boots', 'Ring', 'Amulet'];
  return itemTypes[Math.floor(Math.random() * itemTypes.length)]!;
}