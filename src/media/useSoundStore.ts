import { create } from "zustand";
export const useSoundStore = create<{ enabled: boolean; toggle: () => void; resumeEffects: () => void }>((set) => ({
  // Entry is an explicit user gesture; narration starts audibly unless the user mutes it.
  enabled: true,
  resumeEffects: () => {},
  toggle: () => set((s) => ({ enabled: !s.enabled })),
}));
