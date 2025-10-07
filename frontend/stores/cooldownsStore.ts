import { create } from 'zustand';
import type { Cooldowns } from '../types';

interface CooldownsState extends Cooldowns {
  setCooldowns: (cooldowns: Cooldowns) => void;
  updateAttackCooldown: (cooldown: number) => void;
}

export const useCooldownsStore = create<CooldownsState>((set) => ({
  attack: 0,
  setCooldowns: (cooldowns) => set(cooldowns),
  updateAttackCooldown: (cooldown) => set({ attack: cooldown }),
}));