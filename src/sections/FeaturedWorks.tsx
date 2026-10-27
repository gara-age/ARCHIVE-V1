import { useEffect, useId, useState } from "react";
import { projectStories } from "../data/projectStories";
import { projects } from "../data/projects";
import { demos } from "../data/demos";
import ArchivePhoto from "../components/ArchivePhoto";
import { photos } from "../data/photos";
import DemoVideo from "../components/DemoVideo";
export default function FeaturedWorks() {
  const [selected, setSelected] = useState(0);
  const [openDemo, setOpenDemo] = useState<string | null>(null);
  const instance = useId();
  const project = projects[selected];
  useEffect(() => {
    setOpenDemo(null);
  }, [project.id]);
  const story = projectStories[project.id];
  const demo = demos.find((d) => d.projectId === project.id);
  const activity = photos.find(
    (p) => p.projectId === project.id && p.kind === "activity",
  );
  return (
    <>
      <div className="project-tabs" role="tablist" aria-label="대표 프로젝트">
        {projects.map((p, i) => (
          <button
            id={`${instance}-tab-${p.id}`}
            role="tab"
            aria-selected={selected === i}
            aria-controls={`${instance}-project-panel`}
            tabIndex={selected === i ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                const next =
                  (i + (event.key === "ArrowRight" ? 1 : projects.length - 1)) %
                  projects.length;
                setSelected(next);
                document
                  .getElementById(`${instance}-tab-${projects[next].id}`)
                  ?.focus();
              }
            }}
            onClick={() => setSelected(i)}
            key={p.id}
          >
            <strong>{p.name}</strong>
          </button>
        ))}
      </div>
      <article
        id={`${instance}-project-panel`}
        role="tabpanel"
        aria-labelledby={`${instance}-tab-${project.id}`}
      >
        <header className="work-heading">
          <h2>{project.name}</h2>
          <p>{story.lead}</p>
        </header>
        <div className="work-overview">
          <div className="work-visual">
            {activity && <ArchivePhoto key={activity.id} photo={activity} />}
          </div>
          <aside className="work-summary" aria-label={`${project.name} 핵심 정보`}>
            {demo && <div className="work-award"><span>수상</span><strong>{demo.award}</strong></div>}
            <div className="work-role"><span>담당 역할</span><p>{story.role}</p></div>
            {demo && <button className="work-demo-button" aria-expanded={openDemo === demo.id} aria-controls={`${instance}-demo`} onClick={() => setOpenDemo(openDemo === demo.id ? null : demo.id)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" /></svg>
              {openDemo === demo.id ? "시연 영상 닫기" : "시연 영상 보기"}
            </button>}
            <ul className="work-highlights">{story.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
          </aside>
        </div>
        <div id={`${instance}-demo`} className="work-demo" hidden={!demo || openDemo !== demo.id}>
          {demo && openDemo === demo.id && <DemoVideo key={demo.id} demo={demo} />}
        </div>
        <div className="project-story">
          {story.sections.map((section) => <section className="project-story-section" key={section.title}>
            <h3>{section.title}</h3>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items && <ul>{section.items.map((item) => <li key={item.title}><strong>{item.title}</strong><p>{item.text}</p></li>)}</ul>}
          </section>)}
        </div>
      </article>
    </>
  );
}
