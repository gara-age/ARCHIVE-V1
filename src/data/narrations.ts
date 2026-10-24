export type Narration = { title: string; src: string };
const track = (title: string, filename: string): Narration => ({ title, src: `/media/narration/${filename}.m4a` });
export const sectionNarrations: Record<string, Narration> = {
  opening: track("작업실", "00-studio"),
  achievements: track("수상 및 학업 성과", "02-achievements"),
  certifications: track("자격증", "03-certifications"),
  skills: track("기술 및 경험", "04-experience"),
  campus: track("학과 활동", "05-campus"),
  workstyle: track("업무 스타일", "06-how-i-work"),
  about: track("나의 이야기", "07-my-story"),
  beyond: track("취미 · 가치관 · V1", "08-beyond"),
  contact: track("연락처", "09-contact"),
};
export const projectNarrations: Record<string, Narration> = {
  bokji: track("복지나루", "01-bokji"),
  navi: track("Navi", "01-navi"),
};
export function narrationFor(sectionId: string, projectId = "bokji") {
  return sectionId === "works" ? projectNarrations[projectId] : sectionNarrations[sectionId];
}
