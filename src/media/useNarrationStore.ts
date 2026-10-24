import { create } from "zustand";
type NarrationState = {
  entered: boolean;
  enterStudio: () => void;
  projectId: string;
  title: string;
  available: boolean;
  status: "paused" | "playing" | "ended";
  togglePlayback: () => void;
};
export const useNarrationStore = create<NarrationState>(() => ({
  entered: false, enterStudio: () => {},
  projectId: "bokji", title: "", available: false, status: "paused", togglePlayback: () => {},
}));
