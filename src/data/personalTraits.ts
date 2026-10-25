export type RelatedRecordId = "campus" | "works" | "academics" | "about";
export type TraitId = "connect" | "focus" | "deliver";
export type PersonalTrait = {
  id: TraitId;
  word: string;
  english: string;
  title: string;
  paragraphs: string[];
  highlights: { title: string; description: string }[];
};
// First-person copy and experience details supplied directly by the user.
export const workIntroduction = [
  "저는 상대방의 입장에서 생각하고 소통하며, 새로운 문제를 만나면 스스로 배우고 깊이 탐구합니다. 그리고 아이디어를 제안하는 데 그치지 않고, 끝까지 책임져 실제 결과물로 완성하는 것을 중요하게 생각합니다.",
  "지금까지의 경험을 통해 형성된 저만의 업무 방식을 소개합니다.",
];
export const personalTraits: PersonalTrait[] = [
  {
    id: "connect", word: "CONNECT", english: "Communication & Collaboration",
    title: "상대방의 눈높이에서 이해하고 소통합니다.",
    paragraphs: [
      "저는 좋은 협업의 시작은 상대방을 이해하는 것이라고 생각합니다.",
      "1학년 재학 당시 수업을 따라가는 데 어려움을 겪던 동급생들에게 개념을 설명하고, 학습에 흥미를 가질 수 있도록 도왔습니다. 단순히 지식을 전달하기보다 상대방이 어느 부분에서 어려움을 느끼는지 파악하고, 이해할 수 있는 방식으로 설명하려고 노력했습니다.",
      "이러한 태도는 프로젝트 팀장으로서 팀원들과 협력하고, 학과 홍보 근로장학생으로서 다양한 사람들과 소통하는 경험으로 이어졌습니다.",
      "저에게 소통은 일방적으로 의견을 전달하는 것이 아니라, 서로의 생각을 이해하고 함께 앞으로 나아가는 과정입니다.",
    ],
    highlights: [
      { title: "동급생 학습 지원", description: "프로그래밍 개념 이해를 돕고 학습에 대한 흥미를 높이기 위한 설명과 지원" },
      { title: "프로젝트 리더십", description: "S2CL 팀장으로서 프로젝트 기획, 역할 분담 및 협업" },
      { title: "학과 활동", description: "학과 홍보 근로장학생, 교수 업무 보조, 학생 인솔 및 행사 지원" },
    ],
  },
  {
    id: "focus", word: "FOCUS", english: "Deep Focus & Problem Solving",
    title: "필요한 순간, 스스로 배우고 깊이 파고듭니다.",
    paragraphs: [
      "저는 모르는 것을 마주했을 때 그 자리에 머무르기보다, 직접 배우고 이해하는 과정에 몰입하는 편입니다.",
      "1학년 재학 중 위드시스템 기업 일경험 과정에서 Spring 기반 기업 자산 관리 시스템 개발에 참여했습니다. 당시 Spring 개념을 이해하는 데 어려움을 겪던 2학년 선배를 돕기 위해 유튜브 강의 등 추가 학습 자료를 찾아 스스로 공부하고, 이해한 내용을 설명하며 공유했습니다.",
      "이후에도 복지나루 프로젝트에서 사용자 시점에 따른 인터페이스 조정, 비접촉 입력 방식, 키오스크 목업 구조 등 다양한 문제를 탐구하며 해결 방법을 고민했습니다.",
      "저에게 몰입은 단순히 오랜 시간 집중하는 것이 아니라, 문제를 깊이 이해하고 스스로 해결할 수 있는 역량을 넓혀가는 과정입니다.",
    ],
    highlights: [
      { title: "자기주도 학습", description: "Spring 추가 학습 및 기술 지식 공유" },
      { title: "기업 일경험", description: "PC·모니터 등 기업 자산 관리 시스템 개발" },
      { title: "접근성 기술 탐구", description: "사용자 시점에 따른 UI 조정 및 비접촉 제스처 입력 방식 검토" },
      { title: "시제품 설계", description: "키오스크 목업의 구조, 재료, 조립 및 운반 방식 검토" },
    ],
  },
  {
    id: "deliver", word: "DELIVER", english: "Ownership & Persistence",
    title: "맡은 일은 끝까지 책임지고, 결과물로 완성합니다.",
    paragraphs: [
      "저는 좋은 아이디어도 실제로 구현하고 완성해야 비로소 가치를 가진다고 생각합니다.",
      "위드시스템 기업 일경험 과정에서는 PC와 모니터 등 기업 자산을 관리하는 시스템을 개발했습니다. 다른 팀들이 3명으로 진행하던 프로젝트를 혼자 수행해야 하는 상황이었지만, 개발을 포기하지 않고 최종적으로 시스템을 완성했습니다.",
      "이후 Navi 프로젝트에서는 접근성 지원 프로그램 개발에 참여해 학술대회 우수논문상을 받았으며, 복지나루 프로젝트에서는 기획과 프론트엔드 개발뿐 아니라 키오스크 목업 제작, 시연 영상과 발표자료 준비까지 맡아 진행했습니다.",
      "학업과 프로젝트를 병행하면서도 2026학년도 2학년 1학기에 평점 4.5/4.5와 학과 석차 1위를 기록했습니다.",
      "저에게 책임감은 단순히 맡은 역할을 수행하는 것이 아니라, 어려운 상황에서도 가능한 방법을 찾고 끝까지 결과로 연결하는 태도입니다.",
    ],
    highlights: [
      { title: "기업 자산 관리 시스템", description: "위드시스템 일경험 과정에서 Spring 기반 프로젝트 단독 완수" },
      { title: "Navi 프로젝트", description: "접근성 지원 프로그램 개발 및 학술대회 우수논문상" },
      { title: "복지나루 프로젝트", description: "프로젝트 총괄 및 기획, UI/UX 설계, 프론트엔드 개발, 시연 준비" },
      { title: "실물 시제품 제작", description: "접근성 키오스크 목업 제작 참여" },
      { title: "학업 성취", description: "2026학년도 2학년 1학기 평점 4.5/4.5, 학과 석차 1위" },
    ],
  },
];
export const workPhilosophy = {
  english: "Connect with people. Focus on problems. Deliver results.",
  message: "사람을 이해하고, 문제에 몰입하며, 결과로 증명합니다.",
};
