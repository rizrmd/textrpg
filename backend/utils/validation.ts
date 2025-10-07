// Input validation utilities
export function validatePlayerAction(action: string): boolean {
  const validActions = ['attack', 'heal', 'reset', 'pickLoot', 'selectLocation'];
  return validActions.includes(action);
}

export function validateLocationIndex(locationIndex: number, maxLocations: number): boolean {
  return Number.isInteger(locationIndex) && locationIndex >= 0 && locationIndex < maxLocations;
}

export function validateLootItem(item: any): boolean {
  return item && typeof item === 'object' && item.name && item.rarity;
}

export function sanitizeString(input: string, maxLength: number = 100): string {
  return input.slice(0, maxLength).replace(/[<>\"'&]/g, '');
}