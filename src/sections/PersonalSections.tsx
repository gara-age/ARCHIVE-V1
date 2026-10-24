import { useId, type SyntheticEvent } from "react";
import { academicExcellence as academic, publicAcademicEvidence } from "../data/academics";
import { campusActivities } from "../data/campusActivities";
import { personalTraits, type RelatedRecordId, type TraitId } from "../data/personalTraits";
import { publicTestimonials, testimonials } from "../data/testimonials";
import { hobbies } from "../data/hobbies";
import { interests, interestCategoryLabels } from "../data/interests";
import { demos } from "../data/demos";
import { aboutTopics } from "../data/stories";
import ArchivePhoto from "../components/ArchivePhoto";
import { DemoDisclosure } from "../components/DemoVideo";

function pauseOnClose(event: SyntheticEvent<HTMLDetailsElement>) {
  if (event.target === event.currentTarget && !event.currentTarget.open) {
    event.currentTarget.querySelectorAll("video").forEach((video) => video.pause());
  }
}

export function AcademicExcellence({ related = true }: { related?: boolean }) {
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
      {related && <RelatedRecord id="about" label="학업과 진로 이야기" />}
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
const relatedLabels: Record<RelatedRecordId, string> = {
  campus: "학과 활동", works: "Navi · 복지나루 시연", academics: "2026학년도 1학기 성적", about: "진로와 학업 이야기",
};
// Inline related records preserve the camera, reader expansion, scroll and keyboard focus.
export function RelatedRecord({ id, label }: { id: RelatedRecordId; label?: string }) {
  return (
    <details className="related-record" onToggle={pauseOnClose}>
      <summary>관련 기록 · {label || relatedLabels[id]} <span>↗</span></summary>
      <div className="related-record-body">
        {id === "campus" && <CampusRecord />}
        {id === "works" && demos.map((demo) => <DemoDisclosure key={demo.id} demo={demo} />)}
        {id === "academics" && <AcademicExcellence related={false} />}
        {id === "about" && <><h4>{aboutTopics[0].title}</h4><p>{aboutTopics[0].description}</p></>}
      </div>
    </details>
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
      <details className="content-draft"><summary>활동 기록 더하기</summary><p>활동 기간, 실제 담당 업무와 배운 점, 공개 가능한 사진·자료를 추가할 수 있습니다.</p></details>
    </>
  );
}
export function VoicesAboutMe({ trait }: { trait?: TraitId }) {
  const records = publicTestimonials(testimonials).filter((record) => !trait || record.traits.includes(trait));
  return (
    <section className="voices-board" aria-label="주변 사람들의 평가">
      <span className="eyebrow">VOICES ABOUT ME</span>
      <h3>함께한 사람들의 시선.</h3>
      {records.length ? records.map((record) => (
        <details className="voice-card" key={record.id}>
          <summary>{record.name} · {record.relationship}</summary>
          <blockquote>{record.quote}</blockquote>
          <p>{record.relatedExperience}{record.date && ` · ${record.date}`}</p>
        </details>
      )) : <div className="voice-empty"><p>아직 등록된 평가가 없습니다.</p><span>실제 함께한 사람의 이야기와 공개 동의를 받은 뒤 채워질 자리입니다.</span></div>}
    </section>
  );
}
export function HowIWork() {
  const instance = useId();
  return (
    <>
      <div className="content-intro"><span className="eyebrow">06 / HOW I WORK</span><h2>연결하고, 몰입하고,<br />끝까지 완성합니다.</h2><p>제가 지향하는 업무 방식과 연결된 경험을 살펴보세요.</p></div>
      <div className="trait-board">
        {personalTraits.map((trait, index) => (
          <details className={`trait-card trait-${trait.id}`} key={trait.id} onToggle={pauseOnClose}>
            <summary><span className="trait-index">0{index + 1}</span><span><strong>{trait.word}</strong><small>{trait.english}</small><span>{trait.title}</span></span><span className="trait-plus" aria-hidden="true">+</span></summary>
            <div className="trait-body" id={`${instance}-${trait.id}`}>
              <p>{trait.description}</p><h4>연결된 경험</h4><p>{trait.context}</p>
              {trait.examples.map((example, i) => <article className="trait-example" key={i}><h4>상황</h4><p>{example.situation}</p><h4>행동</h4><p>{example.action}</p><h4>결과</h4><p>{example.result}</p></article>)}
              {!trait.examples.length && <p className="case-placeholder">구체적인 상황·행동·결과 사례를 추가할 자리입니다.</p>}
              {trait.related.map((id) => <RelatedRecord key={id} id={id} />)}
              {publicTestimonials(testimonials).some((record) => record.traits.includes(trait.id)) && <VoicesAboutMe trait={trait.id} />}
            </div>
          </details>
        ))}
      </div>
      <VoicesAboutMe />
    </>
  );
}
export function HobbiesAndValues() {
  return (
    <>
      <section className="hobby-gallery" aria-label="취미 및 특기">
        <span className="eyebrow">HOBBIES & TALENTS</span><h3>손으로 만들던 시간.</h3>
        {hobbies.map((hobby) => <article className="hobby-card" key={hobby.id}><span className="eyebrow">{hobby.period}</span><h4>{hobby.name}</h4><p>{hobby.organization}</p><p>{hobby.description}</p>{hobby.photos.map((photo) => <ArchivePhoto key={photo.id} photo={photo} />)}{hobby.reflection && <p>{hobby.reflection}</p>}</article>)}
        <RelatedRecord id="about" label="제과·제빵에서 소프트웨어로" />
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
