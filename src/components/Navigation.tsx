import { useEffect, useState } from "react";
import { useTourStore } from "../navigation/useTourStore";
import { sections } from "../data/sections";
export default function Navigation() {
  const s = useTourStore();
  const [open, setOpen] = useState(false);
  const locked = s.isTransitioning || s.viewMode === "EXPANDED" || !s.ready;
  const current = sections[s.sectionIndex];
  const readerControls = !!current.objectId;
  useEffect(() => {
    if (s.viewMode === "EXPANDED") setOpen(false);
  }, [s.viewMode]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <button
        className={`contents-toggle ${readerControls ? "reader-navigation" : ""}`}
        aria-expanded={open}
        aria-controls="scene-menu"
        onClick={() => setOpen(!open)}
      >
        목차 <span>{open ? "−" : "+"}</span>
      </button>
      <nav
        id="scene-menu"
        className={`scene-nav ${open ? "menu-open" : ""} ${readerControls ? "reader-menu" : ""}`}
        aria-label="구간 목차"
      >
        {sections.map((section, i) => (
          <button
            key={section.id}
            aria-label={`${section.number} ${section.title}`}
            aria-current={s.sectionIndex === i ? "step" : undefined}
            disabled={locked}
            onClick={() => {
              s.navigate(i);
              setOpen(false);
            }}
          >
            <span className="nav-line" />
            <span className="nav-number">{section.number}</span>
            <span className="nav-label">{section.title}</span>
          </button>
        ))}
      </nav>
      <footer className="tour-footer">
        <div className="footer-location">
          <span className="live-dot" />
          {s.isTransitioning
            ? "MOVING THROUGH THE STUDIO"
            : current.label.toUpperCase()}
          <span className="footer-extra">INTERACTIVE ARCHIVE — VOL. 01</span>
        </div>
        <div className="tour-controls">
          <span className="scene-count">
            {current.number} <i>/ {sections.at(-1)?.number}</i>
          </span>
          <button
            aria-label="이전 구간"
            disabled={locked || s.sectionIndex === 0}
            onClick={() => s.navigate(s.sectionIndex - 1)}
          >
            ←
          </button>
          <button
            aria-label="다음 구간"
            disabled={locked || s.sectionIndex === sections.length - 1}
            onClick={() => s.navigate(s.sectionIndex + 1)}
          >
            →
          </button>
        </div>
      </footer>
      <div className="sr-only" role="status" aria-live="polite">
        {s.isTransitioning
          ? `${current.title} 이동 중`
          : `${current.title}에 도착했습니다`}
      </div>
    </>
  );
}
