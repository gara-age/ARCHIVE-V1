import { create } from "zustand";
export const useSoundStore = create<{ enabled: boolean; toggle: () => void; resumeEffects: () => void }>((set) => ({
  enabled: true,
  resumeEffects: () => {},
  toggle: () => set((s) => ({ enabled: !s.enabled })),
}));
