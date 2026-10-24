export type RelatedRecordId = "campus" | "works" | "academics" | "about";
export type TraitId = "connect" | "focus" | "deliver";
export type PersonalTrait = {
  id: TraitId;
  word: string;
  english: string;
  title: string;
  description: string;
  context: string;
  // A concrete situation/action/result may be added only when actually supplied.
  examples: { situation: string; action: string; result: string; related: RelatedRecordId }[];
  related: RelatedRecordId[];
};
export const personalTraits: PersonalTrait[] = [
  {
    id: "connect", word: "CONNECT", english: "Communication & Collaboration",
    title: "사람과 의견을 연결하는 협업",
    description: "서로 다른 의견을 듣고 조율하며, 공동의 목표를 향해 협력하는 업무 방식을 지향합니다.",
    context: "학과 홍보, 교수 업무 보조, 학생 인솔과 행사 지원에서 사람들과 함께 활동했습니다.",
    examples: [], related: ["campus", "works"],
  },
  {
    id: "focus", word: "FOCUS", english: "Deep Focus & Problem Solving",
    title: "필요한 순간, 문제에 깊이 몰입",
    description: "문제를 만나면 빠르게 집중해 원인을 분석하고 해결 방법을 탐색합니다. 집중의 길이보다 문제를 깊이 들여다보는 태도를 중요하게 생각합니다.",
    context: "Navi와 복지나루의 구현 결과와 시연 기록을 연결했습니다.",
    examples: [], related: ["works"],
  },
  {
    id: "deliver", word: "DELIVER", english: "Ownership & Persistence",
    title: "맡은 일은 끝까지, 결과물로",
    description: "예상하지 못한 문제가 생겨도 책임을 이어가며 결과물을 완성하려는 태도를 지향합니다.",
    context: "Navi·복지나루의 발표와 시연, 2026학년도 2학년 1학기 학업 성과를 함께 살펴볼 수 있습니다.",
    examples: [], related: ["works", "academics"],
  },
];
