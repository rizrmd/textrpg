import { create } from 'zustand';

interface UIState {
  selectedEquipmentType: string | null;
  showEquipmentPopup: boolean;
  setSelectedEquipmentType: (type: string | null) => void;
  setShowEquipmentPopup: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedEquipmentType: null,
  showEquipmentPopup: false,
  setSelectedEquipmentType: (type) => set({ selectedEquipmentType: type }),
  setShowEquipmentPopup: (show) => set({ showEquipmentPopup: show }),
}));