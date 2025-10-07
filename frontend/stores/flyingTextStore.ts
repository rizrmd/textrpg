import { create } from 'zustand';
import type { FlyingText } from '../types';

interface FlyingTextState {
  flyingTexts: FlyingText[];
  previousHp: { player: number; enemy: number };
  setFlyingTexts: (texts: FlyingText[]) => void;
  addFlyingTexts: (texts: FlyingText[]) => void;
  removeFlyingTexts: (ids: number[]) => void;
  setPreviousHp: (hp: { player: number; enemy: number }) => void;
}

export const useFlyingTextStore = create<FlyingTextState>((set) => ({
  flyingTexts: [],
  previousHp: { player: 100, enemy: 50 },
  setFlyingTexts: (texts) => set({ flyingTexts: texts }),
  addFlyingTexts: (texts) => set((state) => ({ flyingTexts: [...state.flyingTexts, ...texts] })),
  removeFlyingTexts: (ids) => set((state) => ({
    flyingTexts: state.flyingTexts.filter((ft) => !ids.includes(ft.id))
  })),
  setPreviousHp: (hp) => set({ previousHp: hp }),
}));