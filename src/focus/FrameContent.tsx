import SoundToggle from "../components/SoundToggle";
import { useEffect, useRef } from "react";
import { useTourStore } from "../navigation/useTourStore";
import { sectionContent } from "../sections/ArchiveSections";
import { sections } from "../data/sections";
import { focusSurfaces } from "../data/cameraRoutes";
export default function FrameContent() {
  const mode = useTourStore((s) => s.viewMode);
  const index = useTourStore((s) => s.sectionIndex);
  const section = sections[index];
  const scrollAreas = useRef<Record<string, HTMLDivElement | null>>({});
  const previousIndex = useRef(index);
  const expanded = mode === "EXPANDED";
  const visible = expanded || mode === "FOCUSED";
  const container = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previous = useRef(false);
  useEffect(() => {
    if (expanded) closeButton.current?.focus();
    else if (previous.current) expandButton.current?.focus();
    else if (visible) container.current?.focus({ preventScroll: true });
    previous.current = expanded;
  }, [expanded, visible]);
  useEffect(() => {
    if (visible && previousIndex.current !== index) {
      container.current?.focus({ preventScroll: true });
    }
    previousIndex.current = index;
  }, [index, visible]);
  useEffect(() => {
    if (!expanded) return;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || document.querySelector("dialog[open]")) return;
      const nodes = container.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]),a[href],[tabindex="0"],video[controls],summary',
      );
      if (!nodes?.length) return;
      const active = Array.from(nodes).filter(
        (node) => !node.closest("[hidden]") && node.getClientRects().length > 0,
      );
      if (!active.length) return;
      const first = active[0],
        last = active[active.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", trap);
    return () => window.removeEventListener("keydown", trap);
  }, [expanded]);
  return (
    <>
      <div
        className={`focus-dim ${visible ? "visible" : ""}`}
        aria-hidden="true"
      />
      <div
        ref={container}
        data-content
        data-section={section.id}
        role={expanded ? "dialog" : "region"}
        aria-modal={expanded || undefined}
        aria-label={`${section.title} 아카이브`}
        tabIndex={-1}
        className={`frame-content ${visible ? "visible" : ""} ${expanded ? "expanded" : "reader-default"} ${focusSurfaces[section.id]?.kind === "frame" ? "gallery-frame" : ""}`}
        inert={!visible}
      >
        <div className="monitor-toolbar">
          <span>
            <span className="reader-section-number">{section.number}</span> {section.title}
          </span>
          <SoundToggle compact />
          {expanded ? (
            <button
              ref={closeButton}
              onClick={() => useTourStore.getState().collapse()}
              aria-label="확대 닫기"
            >
              닫기 <span aria-hidden="true">×</span>
            </button>
          ) : (
            <button
              ref={expandButton}
              onClick={() => useTourStore.getState().expand()}
              aria-label="콘텐츠 확대"
            >
              <span className="reader-expand-label" aria-hidden="true">전체화면</span><span className="reader-expand-short" aria-hidden="true">확대</span> <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
        {Object.entries(sectionContent).map(([id, Content]) => (
          <div
            key={id}
            ref={(node) => {
              scrollAreas.current[id] = node;
            }}
            className="content-scroll"
            hidden={section.id !== id}
          >
            <Content />
          </div>
        ))}
        <div className="monitor-footer">
          <span>ARCHIVE V1</span>
          <span>작품 · 경험 · 배움의 기록</span>
          <span>아래로 스크롤 ↓</span>
        </div>
      </div>
    </>
  );
}
