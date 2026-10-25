import SoundToggle from "./SoundToggle";
import BrandLogo from "./BrandLogo";
import { profile } from "../data/profile";
import { sections } from "../data/sections";
import { sectionContent, Contact } from "../sections/ArchiveSections";
export default function FallbackResume({ onClose }: { onClose?: () => void }) {
  return (
    <main className="fallback" data-content>
      <header>
        <span className="wordmark">
          <BrandLogo />
        </span>
        <SoundToggle />
        {onClose ? (
          <button onClick={onClose}>작업실 돌아가기 ↗</button>
        ) : (
          <span>WebGL을 사용할 수 없어 HTML로 표시합니다.</span>
        )}
      </header>
      <section>
        <span className="eyebrow">A PERSONAL INTERACTIVE ARCHIVE</span>
        <h1>
          {profile.englishName}
          <br />
          <em>{profile.name}</em>
        </h1>
        <p>{profile.message}</p>
        <p>프로젝트와 경력, 배움의 기록을 한눈에 확인하세요.</p>
        <nav className="resume-index" aria-label="이력서 목차">
          {sections.slice(1).map((s) => (
            <a key={s.id} href={`#resume-${s.id}`}>
              {s.number} {s.title}
            </a>
          ))}
        </nav>
        {Object.entries(sectionContent).map(([id, Content]) => (
          <section className="resume-section" id={`resume-${id}`} key={id}>
            <Content />
          </section>
        ))}
        <section className="resume-section" id="resume-contact">
          <Contact />
        </section>
      </section>
    </main>
  );
}
