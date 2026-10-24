export type Achievement = {
  name: string;
  competition: string;
  organizer: string;
  date: string;
  project: string | null;
  image: string | null;
  projectId: string;
  demoId: string;
  photoId: string;
};
// Awards: provided resume p.2. Project and demonstration mapping: explicitly confirmed by the user.
export const achievements: Achievement[] = [
  {
    name: "우수논문상",
    competition: "2026 전반기 학술발표대회",
    organizer: "한국산업기술융합학회",
    date: "2026.06",
    project: "Navi",
    projectId: "navi",
    demoId: "navi-academic",
    photoId: "navi-certificate",
    image: "/media/photos/navi-certificate.webp",
  },
  {
    name: "동상 · 한국반도체산업협회장상",
    competition: "제10회 벤처창업경진대회",
    organizer: "학교법인 한국폴리텍대학",
    date: "2026.10",
    project: "복지나루",
    projectId: "bokji",
    demoId: "bokji-venture",
    photoId: "bokji-award",
    image: "/media/photos/bokji-award.webp",
  },
];
