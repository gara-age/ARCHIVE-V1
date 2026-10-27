import { create } from "zustand";

type StudioState = {
  entered: boolean;
  enterStudio: () => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  entered: false,
  enterStudio: () => set({ entered: true }),
}));
