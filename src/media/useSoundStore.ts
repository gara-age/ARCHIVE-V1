import { create } from "zustand";
export const useSoundStore = create<{ enabled: boolean; toggle: () => void; resumeEffects: () => void; startMusic: () => void }>((set) => ({
  // Music starts after entering the studio, unless the user mutes it.
  enabled: true,
  resumeEffects: () => {},
  startMusic: () => {},
  toggle: () => set((s) => ({ enabled: !s.enabled })),
}));
