import { useEffect, useRef } from "react";
import { useTourStore } from "./useTourStore";
import { createWheelGate } from "./input.mjs";
export default function TourController() {
  const wheelGate = useRef(createWheelGate());
  useEffect(() => {
    const wheel = (e: WheelEvent) => {
      const now = performance.now();
      const s = useTourStore.getState();
      const inside =
        !!document.querySelector("dialog[open]") ||
        (e.target instanceof Element &&
          !!e.target.closest("[data-content],nav,button"));
      const delta =
        e.deltaY *
        (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      const step = wheelGate.current({
        mode: s.viewMode,
        now,
        lockedUntil: s.lockedUntil,
        delta,
        inside,
      });
      if (!inside) e.preventDefault();
      if (step) s.navigate(s.sectionIndex + step);
    };
    const key = (e: KeyboardEvent) => {
      const s = useTourStore.getState();
      if (document.fullscreenElement || document.querySelector("dialog[open]"))
        return;
      if (e.key === "Escape") {
        s.collapse();
        return;
      }
      if (
        e.target instanceof Element &&
        e.target.closest("[data-content],button,a,input,select,textarea")
      )
        return;
      if (
        [
          "ArrowDown",
          "ArrowRight",
          "PageDown",
          "ArrowUp",
          "ArrowLeft",
          "PageUp",
        ].includes(e.key)
      ) {
        e.preventDefault();
        s.navigate(
          s.sectionIndex +
            (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key) ? 1 : -1),
        );
      }
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key, true);
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key, true);
    };
  }, []);
  return null;
}
