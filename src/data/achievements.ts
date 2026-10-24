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
  description: string[];
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
    description: [
      "자연어 명령 기반 PC 작업 자동화 에이전트 ‘Navi’를 주제로, 「디지털 취약계층의 작업 접근성 향상을 위한 자연어 명령 기반 UI 자동화 Agent 시스템 설계」라는 학술논문을 작성했습니다. 팀장이자 주저자로서 연구 내용과 프로젝트 결과를 직접 발표하여 우수논문상을 수상했습니다.",
      "프로젝트의 기획과 사용자 경험 설계, 프론트엔드 개발을 주도했으며, 연구의 문제 정의부터 기술적 접근 방식과 구현 결과까지 발표를 통해 전달했습니다.",
    ],
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
    description: [
      "사용자 맞춤형 AI 공공민원 안내 키오스크 ‘복지나루’의 팀장으로서 서비스 기획과 개발 방향을 총괄하고, UI/UX 및 접근성 설계와 프론트엔드 개발을 담당했습니다.",
      "팀원과 협력하여 AI 민원 상담 기능을 통합하고 실제 키오스크 목업을 제작했으며, 최종 발표에서 서비스의 개발 배경과 핵심 기술, 차별성 및 활용 가능성을 설명하여 동상을 수상했습니다.",
    ],
  },
];
