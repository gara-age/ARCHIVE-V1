import { useState } from "react";
import { achievements } from "../data/achievements";
import { academicRecords, certifications } from "../data/certifications";
import { skills, skillTopics } from "../data/skills";
import { experiences } from "../data/experiences";
import { aboutTopics, beyondStory, introductionVideo } from "../data/stories";
import { contacts, profile } from "../data/profile";
import { demos } from "../data/demos";
import ArchivePhoto from "../components/ArchivePhoto";
import { photos } from "../data/photos";
import { DemoDisclosure } from "../components/DemoVideo";
import FeaturedWorks from "./FeaturedWorks";
import { AcademicExcellence, CampusActivities, HowIWork, HobbiesAndValues, RelatedRecord } from "./PersonalSections";
function Intro({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="content-intro">
      <span className="eyebrow">ARCHIVE / {number}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function Achievements() {
  return (
    <>
      <Intro
        number="02 · ACHIEVEMENTS"
        title="작품의 성과, 배움의 성취."
      />
      <AcademicExcellence />
      <h3 className="subsection-title">Awards <span>작품 수상 기록</span></h3>
      <div className="award-list">
        {achievements.map((a) => {
          const demo = demos.find((d) => d.id === a.demoId);
          const photo = photos.find((p) => p.id === a.photoId);
          const presentation = photos.find(
            (p) => p.projectId === a.projectId && p.kind === "activity",
          );
          return (
            <article className="award-card" key={a.name}>
              <div className="award-card-heading">
                <div>
                  <span className="eyebrow">
                    {a.date} · {a.competition}
                  </span>
                  <h3>{a.name}</h3>
                  <p>{a.organizer}</p>
                </div>
              </div>
              <div className="award-project">
                <span>수상 관련 작품</span>
                <strong>{a.project}</strong>
              </div>
              <div className="award-gallery">
                {photo && <ArchivePhoto photo={photo} />}
                {presentation && <ArchivePhoto photo={presentation} />}
              </div>
              {demo && <DemoDisclosure demo={demo} />}
            </article>
          );
        })}
      </div>
    </>
  );
}
export function Certifications() {
  return (
    <>
      <Intro
        number="03 · CERTIFICATIONS"
        title="취득 자격과 학습의 증거."
      />
      <div className="credential-list">
        {certifications.map((c) => (
          <article className="credential-card" key={c.name}>
            <div className="credential-top">
              <span
                className={`status-tag ${c.status === "취득 완료" ? "complete" : "partial"}`}
              >
                {c.status}
              </span>
              <time>{c.date}</time>
            </div>
            <h3>{c.name}</h3>
            <p>{c.issuer}</p>
            {c.skills.length > 0 && <p>{c.skills.join(" · ")}</p>}
          </article>
        ))}
      </div>
      <RelatedRecord id="academics" label="학업 성과 · 2026학년도 1학기" />
      <h3 className="subsection-title">
        Education <span>학업 기록</span>
      </h3>
      {academicRecords.map((a) => (
        <article className="education-card" key={a.title}>
          <span className="eyebrow">{a.period}</span>
          <h3>{a.institution}</h3>
          <p>{a.title}</p>
          <span>{a.detail}</span>
        </article>
      ))}
    </>
  );
}
export function SkillsExperience() {
  const [tab, setTab] = useState("경험");
  return (
    <>
      <Intro
        number="04 · SKILLS & EXPERIENCE"
        title="경험 위에 쌓는 기술."
        description="수치 대신 실제 경험과 근거로 연결하는 역량의 기록."
      />
      <div className="filter-row" role="group" aria-label="기술 및 경험 보기">
        {["경험", "기술 연결"].map((t) => (
          <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      {tab === "경험" ? (
        <div className="experience-list">
          {experiences.map((e, i) => (
            <article
              className="experience-item"
              key={`${e.organization}-${e.period}`}
            >
              <span className="timeline-dot" />
              <div className="experience-period">{e.period}</div>
              <span className="eyebrow">
                {i === 0
                  ? "SOFTWARE / INTERNSHIP"
                  : e.role === "제과/제빵사"
                    ? "BEYOND CODE"
                    : "CUSTOMER EXPERIENCE"}
              </span>
              <h3>{e.organization}</h3>
              <h4>{e.title}</h4>
              {e.description && <p>{e.description}</p>}
              {i === 0 && <span className="status-tag">{e.role}</span>}
            </article>
          ))}
        </div>
      ) : (
        <>
          <p className="placeholder-note">
            이력서에는 프로젝트별 사용 기술이 기재되어 있지 않습니다. 아래
            기술은 명세서의 정리 대상이며, 사용 경험이나 숙련도에 대한 주장이
            아닙니다.
          </p>
          <div className="skill-topics">
            {skillTopics.map((topic) => (
              <div key={topic}>
                <strong>{topic}</strong>
                <span>프로젝트 사용 근거 입력 예정</span>
              </div>
            ))}
          </div>
          {skills.map((s) => (
            <article key={s.name}>
              <h3>{s.name}</h3>
              <p>
                {s.project} · {s.usage}
              </p>
            </article>
          ))}
        </>
      )}
    </>
  );
}
export function AboutMe() {
  return (
    <>
      <Intro
        number="07 · ABOUT ME"
        title="다른 경험이 만나는 곳."
        description="제과·제빵, 전화상담, 그리고 소프트웨어. 최민서의 기록입니다."
      />
      {introductionVideo ? (
        <video
          className="intro-video"
          controls
          preload="none"
          poster={introductionVideo.poster}
        >
          <source src={introductionVideo.src} />
          <track
            kind="captions"
            src={introductionVideo.captions}
            srcLang="ko"
            label="한국어"
            default
          />
        </video>
      ) : null}
      <div className="about-topics">
        {aboutTopics.map((topic, i) => (
          <article key={topic.title}>
            <span className="eyebrow">0{i + 1}</span>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
          </article>
        ))}
      </div>
    </>
  );
}
export function BeyondCode() {
  return (
    <>
      <Intro
        number="08 · BEYOND CODE / V1 SPEED"
        title="결심하고, 앞으로."
        description="V1 — 첫 번째 기록, 그리고 다음을 향한 결정."
      />
      <div className="flight-art">
        <span>ARCHIVE V1 / CLEARED FOR WHAT'S NEXT</span>
        <strong>V1</strong>
        <span className="flight-line" />
        <span>DECISION → DIRECTION → DEPARTURE</span>
      </div>
      <h3 className="story-title">{beyondStory.title}</h3>
      <p className="story-paragraph">{beyondStory.description}</p>
      <HobbiesAndValues />
    </>
  );
}
export function Contact({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "contact-compact" : ""}>
      <Intro
        number="09 · CONTACT"
        title="다음 이야기를 함께."
        description="작업실을 둘러봐 주셔서 감사합니다."
      />
      <h3 className="contact-name">
        {profile.name} <span>{profile.englishName}</span>
      </h3>
      <div className="contact-links">
        {contacts.map((c) => (
          <div key={c.label}>
            <span className="eyebrow">{c.label}</span>
            {c.href && c.value ? (
              <a href={c.href}>
                {c.value}
                <span>↗</span>
              </a>
            ) : (
              <p className="contact-pending">링크 준비 중</p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
export const sectionContent = {
  works: FeaturedWorks,
  achievements: Achievements,
  certifications: Certifications,
  skills: SkillsExperience,
  campus: CampusActivities,
  workstyle: HowIWork,
  about: AboutMe,
  beyond: BeyondCode,
};
