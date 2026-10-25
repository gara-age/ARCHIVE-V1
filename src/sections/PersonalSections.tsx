import { useId, type SyntheticEvent } from "react";
import { academicExcellence as academic, publicAcademicEvidence } from "../data/academics";
import { campusActivities } from "../data/campusActivities";
import { personalTraits, workIntroduction, workPhilosophy } from "../data/personalTraits";
import { publicTestimonials, testimonials } from "../data/testimonials";
import { hobbies } from "../data/hobbies";
import { interests, interestCategoryLabels } from "../data/interests";
import ArchivePhoto from "../components/ArchivePhoto";

function pauseOnClose(event: SyntheticEvent<HTMLDetailsElement>) {
  if (event.target === event.currentTarget && !event.currentTarget.open) {
    event.currentTarget.querySelectorAll("video").forEach((video) => video.pause());
  }
}

export function AcademicExcellence() {
  const photo = publicAcademicEvidence(academic);
  return (
    <article className="academic-board">
      <header className="academic-heading">
        <h3>Academic Excellence</h3>
        <p className="academic-term">{academic.academicYear}학년도 · {academic.year}학년 {academic.semester}학기</p>
      </header>
      <div className="academic-results">
        <div className="academic-gpa"><span>학기 평점</span><strong>{academic.gpa.toFixed(1)}<small> / {academic.scale.toFixed(1)}</small></strong></div>
        <div><span>학과 석차</span><strong>{academic.departmentRank}<small>위</small></strong></div>
        <div><span>전공 석차</span><strong>{academic.majorRank}<small>위</small></strong></div>
      </div>
      <p className="academic-institution">{academic.institution} · {academic.department}</p>
      {photo && <ArchivePhoto photo={photo} />}
    </article>
  );
}
function CampusRecord() {
  return (
    <article className="campus-card">
      <span className="eyebrow">{campusActivities[0].organization}</span>
      <h3>학과 홍보 · 업무 및 행사 지원</h3>
      <ul className="campus-responsibilities">
        {campusActivities.map((activity) => (
          <li key={activity.id}>
            <strong>{activity.title}</strong>
            <p className="activity-description">{activity.description}</p>
            {activity.period && <time>{activity.period}</time>}
            {activity.photos.map((photo) => <ArchivePhoto key={photo.id} photo={photo} />)}
            {activity.materials.map((material) => <a key={material.href} href={material.href}>{material.label} ↗</a>)}
            {activity.learning && <p>{activity.learning}</p>}
          </li>
        ))}
      </ul>
    </article>
  );
}
export function CampusActivities() {
  return (
    <>
      <div className="content-intro">
        <span className="eyebrow">05 / CAMPUS ACTIVITIES</span>
        <h2>교실 밖에서도,<br />함께 움직이는 사람.</h2>
        <p>학과 홍보와 업무 보조, 학생 인솔과 행사 지원. 사람들과 소통하며 학과의 일에 참여했습니다.</p>
      </div>
      <div className="campus-board"><div><span className="note-pin" aria-hidden="true" /><CampusRecord /></div></div>
    </>
  );
}
export function VoicesAboutMe() {
  const records = publicTestimonials(testimonials);
  if (!records.length) return null;
  return (
    <section className="voices-board" aria-label="주변 사람들의 평가">
      <span className="eyebrow">VOICES ABOUT ME</span>
      <h3>함께한 사람들의 시선.</h3>
      <div className="voice-list">
        {records.map((record) => (
          <figure className="voice-card" key={record.id}>
            <blockquote><p>{record.quote}</p></blockquote>
            <figcaption>
              <strong>{record.name}{record.relationship === "지도교수" ? " 교수" : ""}</strong>
              <span>{record.relationship}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
export function HowIWork() {
  const instance = useId();
  return (
    <>
      <div className="content-intro"><span className="eyebrow">06 / HOW I WORK</span><h2>연결하고, 몰입하고,<br />끝까지 완성합니다.</h2>{workIntroduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <div className="trait-board">
        {personalTraits.map((trait, index) => (
          <details className={`trait-card trait-${trait.id}`} key={trait.id} onToggle={pauseOnClose}>
            <summary><span className="trait-index">0{index + 1}</span><span><strong>{trait.word}</strong><small>{trait.english}</small><span>{trait.title}</span></span><span className="trait-plus" aria-hidden="true">+</span></summary>
            <div className="trait-body" id={`${instance}-${trait.id}`}>
              <div className="trait-narrative">{trait.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              <h4>주요 경험</h4>
              <ul className="trait-highlights">{trait.highlights.map((experience) => <li key={experience.title}><strong>{experience.title}:</strong> {experience.description}</li>)}</ul>
            </div>
          </details>
        ))}
      </div>
      <VoicesAboutMe />
      <section className="work-philosophy" aria-label="업무 철학">
        <span className="eyebrow">MY WORK PHILOSOPHY</span>
        <h3>{workPhilosophy.english}</h3>
        <p>{workPhilosophy.message}</p>
      </section>
    </>
  );
}
export function HobbiesAndValues() {
  return (
    <>
      <section className="hobby-gallery" aria-label="취미 및 특기">
        <span className="eyebrow">HOBBIES & TALENTS</span><h3>손으로 만들던 시간.</h3>
        {hobbies.map((hobby) => <article className="hobby-card" key={hobby.id}><span className="eyebrow">{hobby.period}</span><h4>{hobby.name}</h4><p>{hobby.organization}</p><p>{hobby.description}</p>{hobby.photos.map((photo) => <ArchivePhoto key={photo.id} photo={photo} />)}{hobby.reflection && <p>{hobby.reflection}</p>}</article>)}
      </section>
      <section className="values-board" aria-label="좋아하는 것과 가치관">
        <span className="eyebrow">PERSONAL INTERESTS & VALUES</span>
        <h3>취향과 생각의 조각들.</h3>
        <div className="interest-grid">
          {interests.map((interest) => (
            <article className={`interest-card ${interest.isExample ? "is-example" : "is-personal"}`} key={interest.id}>
              <div className="interest-label"><span>{interestCategoryLabels[interest.category]}</span>{interest.isExample && <span className="example-tag">예시</span>}</div>
              <h4>{interest.title}</h4>
              <p>{interest.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
