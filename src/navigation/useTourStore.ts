import { create } from "zustand";
import { sections } from "../data/sections";
import { cameraRoutes } from "../data/cameraRoutes";
export type ViewMode = "WORKSPACE" | "FLYING" | "FOCUSED" | "EXPANDED";
type State = {
  sectionIndex: number;
  viewMode: ViewMode;
  activeObjectId: string | null;
  isTransitioning: boolean;
  lockedUntil: number;
  ready: boolean;
  rect: { left: number; top: number; width: number; height: number };
  navigate: (index: number) => void;
  arrive: () => void;
  expand: () => void;
  collapse: () => void;
  setReady: () => void;
  reloadScene: () => void;
  setRect: (rect: State["rect"]) => void;
};
export const useTourStore = create<State>((set, get) => ({
  sectionIndex: 0,
  viewMode: "WORKSPACE",
  activeObjectId: null,
  isTransitioning: false,
  lockedUntil: 0,
  ready: false,
  rect: { left: 0, top: 0, width: 0, height: 0 },
  navigate: (index) => {
    const s = get();
    if (
      !s.ready ||
      index === s.sectionIndex ||
      index < 0 ||
      index >= sections.length ||
      s.viewMode === "EXPANDED" ||
      s.isTransitioning ||
      performance.now() < s.lockedUntil
    )
      return;
    set({
      sectionIndex: index,
      viewMode: "FLYING",
      activeObjectId: null,
      isTransitioning: true,
    });
  },
  arrive: () =>
    set((s) => ({
      viewMode: sections[s.sectionIndex].objectId ? "FOCUSED" : "WORKSPACE",
      activeObjectId: sections[s.sectionIndex].objectId,
      isTransitioning: false,
      lockedUntil: performance.now() + cameraRoutes.cooldown,
    })),
  expand: () => {
    if (get().viewMode === "FOCUSED") set({ viewMode: "EXPANDED" });
  },
  collapse: () => {
    if (get().viewMode === "EXPANDED")
      set({
        viewMode: "FOCUSED",
        lockedUntil: performance.now() + cameraRoutes.cooldown,
      });
  },
  setReady: () => set({ ready: true }),
  reloadScene: () => set((s) => ({
    ready: false, isTransitioning: false, lockedUntil: 0,
    viewMode: s.viewMode === "EXPANDED" ? "EXPANDED" : sections[s.sectionIndex].objectId ? "FOCUSED" : "WORKSPACE",
    activeObjectId: sections[s.sectionIndex].objectId,
  })),
  setRect: (rect) => set({ rect }),
}));
