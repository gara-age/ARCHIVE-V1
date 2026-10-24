import { useNarrationStore } from "../media/useNarrationStore";
import { useEffect, useId, useState } from "react";
import { projectStories } from "../data/projectStories";
import { projects } from "../data/projects";
import { demos } from "../data/demos";
import ArchivePhoto from "../components/ArchivePhoto";
import { photos } from "../data/photos";
import { DemoDisclosure } from "../components/DemoVideo";
export default function FeaturedWorks() {
  const [selected, setSelected] = useState(0);
  const instance = useId();
  const project = projects[selected];
  useEffect(() => { useNarrationStore.setState({ projectId: project.id }); }, [project.id]);
  const story = projectStories[project.id];
  const demo = demos.find((d) => d.projectId === project.id);
  const activity = photos.find(
    (p) => p.projectId === project.id && p.kind === "activity",
  );
  return (
    <>
      <div className="content-intro">
        <span className="eyebrow">01 / FEATURED WORKS</span>
        <h2>작품과 시연, 수상의 기록.</h2>
      </div>
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
            <span>0{i + 1}</span>
            <strong>{p.name}</strong>
            <small>
              {demos.find((d) => d.projectId === p.id)?.id === "navi-academic"
                ? "우수논문상 · 시연"
                : demos.some((d) => d.projectId === p.id)
                  ? "동상 · 시연"
                  : "자료 준비 중"}
            </small>
          </button>
        ))}
      </div>
      <article
        id={`${instance}-project-panel`}
        role="tabpanel"
        aria-labelledby={`${instance}-tab-${project.id}`}
      >
        {demo ? (
          <>
            <div className="project-photo-heading">
              <h3>{project.name}</h3>
              <span className="award-badge">{demo.award}</span>
            </div>
            <p className="project-lead">{story.summary}</p>
            {activity && <ArchivePhoto key={activity.id} photo={activity} />}
            <DemoDisclosure key={demo.id} demo={demo} />
          </>
        ) : (
          <div className="project-art" style={{ background: project.color }}>
            <span className="art-grid" />
            <span className="art-small">ARCHIVE V1 / PROJECT STUDY</span>
            <strong>{project.english}</strong>
            <span className="art-tag">실제 구현 화면·영상 준비 중</span>
          </div>
        )}
        {!demo && (
          <div className="project-heading">
            <div>
              <h3>{project.name}</h3>
            </div>
          </div>
        )}
        {!demo && <p className="project-lead">{project.description}</p>}
        <div className="project-story">
          {story.sections.map((section) => <section className="project-story-section" key={section.title}>
            <h4>{section.title}</h4>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items && <ul>{section.items.map((item) => <li key={item.title}><strong>{item.title}</strong><p>{item.text}</p></li>)}</ul>}
          </section>)}
        </div>
      </article>
    </>
  );
}
