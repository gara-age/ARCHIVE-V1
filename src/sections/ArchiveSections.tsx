import { useSoundStore } from "../media/useSoundStore";
import { assetUrl } from "../utils/assetUrl";
import { achievements } from "../data/achievements";
import { academicRecords, certifications } from "../data/certifications";
import { experiences } from "../data/experiences";
import { storyJourney, nextDirection, beyondStory, introductionVideo } from "../data/stories";
import { contacts, profile } from "../data/profile";
import { demos } from "../data/demos";
import ArchivePhoto from "../components/ArchivePhoto";
import { photos } from "../data/photos";
import { DemoDisclosure } from "../components/DemoVideo";
import FeaturedWorks from "./FeaturedWorks";
import { AcademicExcellence, CampusActivities, HowIWork, HobbiesAndValues } from "./PersonalSections";
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
                  <p>수여 기관 · {a.organizer}</p>
                </div>
              </div>
              <div className="award-project">
                <span>수상 작품</span>
                <strong>{a.project}</strong>
              </div>
              <div className="award-description">
                {a.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
  return (
    <>
      <Intro
        number="04 · SKILLS & EXPERIENCE"
        title="경험 위에 쌓는 기술."
        description="수치 대신 실제 경험과 근거로 연결하는 역량의 기록."
      />
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
                  ? "SOFTWARE / WORK EXPERIENCE"
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

    </>
  );
}
export function AboutMe() {
  const soundEnabled = useSoundStore((s) => s.enabled);
  return (
    <>
      <Intro
        number="07 · MY STORY"
        title="경험을 쌓으며, 방향을 만들어 갑니다."
        description="제과·제빵, 전화상담, 그리고 소프트웨어. 최민서의 기록입니다."
      />
      {introductionVideo ? (
        <video
          className="intro-video"
          muted={!soundEnabled}
          controls
          preload="none"
          poster={introductionVideo.poster && assetUrl(introductionVideo.poster)}
        >
          <source src={assetUrl(introductionVideo.src)} />
          <track
            kind="captions"
            src={assetUrl(introductionVideo.captions)}
            srcLang="ko"
            label="한국어"
            default
          />
        </video>
      ) : null}
      <section className="story-journey" aria-label="경험 타임라인">
        <span className="eyebrow">MY JOURNEY</span>
        <h3>지금의 저를 만든 경험.</h3>
        <ol className="journey-timeline">
          {storyJourney.map((step) => (
            <li key={step.title}>
              <span className="journey-period">{step.period}</span>
              <div><h4>{step.title}</h4><p>{step.description}</p></div>
            </li>
          ))}
        </ol>
      </section>
      <section className="next-direction" aria-label="다음으로 향하는 방향">
        <span className="eyebrow">NEXT DIRECTION</span>
        <h3>{nextDirection.title}</h3>
        <div className="direction-copy">{nextDirection.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <p className="direction-closing">{nextDirection.closing}</p>
        <footer className="direction-motto">
          <span className="eyebrow">MY NEXT DIRECTION</span>
          <h4>{nextDirection.motto}</h4>
          <p>{nextDirection.message}</p>
        </footer>
      </section>
    </>
  );
}
export function BeyondCode() {
  return (
    <>
      <Intro
        number="08 · BEYOND CODE / V1 SPEED"
        title="결심하고, 앞으로."
      />
      <section className="v1-statement" aria-label="ARCHIVE V1에 담은 의미">
        <span className="eyebrow">WHY V1</span>
        <h3>{beyondStory.title}</h3>
        <p>{beyondStory.description}</p>
        <p>{beyondStory.commitment}</p>
      </section>
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
      <p className="music-credit">
        배경음악 · <a href="https://commons.wikimedia.org/wiki/File:Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg" target="_blank" rel="noreferrer">Clair de lune — Claude Debussy</a><br />
        연주 Laurens Goedhart · <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer">CC BY 3.0</a> · 음량 조정
      </p>
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
