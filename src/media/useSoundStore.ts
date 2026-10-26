import { create } from "zustand";
export const useSoundStore = create<{ enabled: boolean; toggle: () => void; resumeEffects: () => void; startMusic: () => void }>((set) => ({
  // Entry is an explicit user gesture; narration starts audibly unless the user mutes it.
  enabled: true,
  resumeEffects: () => {},
  startMusic: () => {},
  toggle: () => set((s) => ({ enabled: !s.enabled })),
}));
