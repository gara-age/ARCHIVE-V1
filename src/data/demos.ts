export type Demo = {
  id: string;
  projectId: string;
  projectName: string;
  competition: string;
  award: string;
  src: string;
  poster: string;
  summary: string;
  captions: string | null;
};
// Competition and project mapping explicitly confirmed by the user.
export const demos: Demo[] = [
  {
    id: "navi-academic",
    projectId: "navi",
    projectName: "Navi",
    competition: "2026 전반기 학술발표대회",
    award: "우수논문상",
    src: "/media/demos/navi-academic.mp4",
    poster: "/media/demos/navi-academic.jpg",
    summary:
      "음성 입력, 날씨 검색, 길찾기 화면을 담은 Navi의 학술발표대회 시연입니다.",
    captions: null,
  },
  {
    id: "bokji-venture",
    projectId: "bokji",
    projectName: "복지나루",
    competition: "제10회 벤처창업경진대회",
    award: "동상 · 한국반도체산업협회장상",
    src: "/media/demos/bokji-venture.mp4",
    poster: "/media/demos/bokji-venture.jpg",
    summary:
      "음성 입력과 복지지원 안내 화면을 확인할 수 있는 복지나루의 벤처창업경진대회 시연입니다.",
    captions: null,
  },
];
