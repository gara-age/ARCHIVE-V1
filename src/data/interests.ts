export type InterestCategory = "favorite" | "interest" | "quote" | "value" | "goal" | "attitude";
export type PersonalInterest = {
  id: string;
  category: InterestCategory;
  title: string;
  description: string;
  isExample: boolean;
};
export const interestCategoryLabels: Record<InterestCategory, string> = {
  favorite: "좋아하는 것",
  interest: "관심 분야",
  quote: "좋아하는 문구",
  value: "가치관",
  goal: "개인적인 목표",
  attitude: "중요하게 생각하는 태도",
};
// V1 is confirmed. The other entries are user-requested dummy content, explicitly labeled in the UI.
export const interests: PersonalInterest[] = [
  {
    id: "v1", category: "value", isExample: false,
    title: "V1 — The Decision to Take Off",
    description: "이륙결심속도 V1에서 가져온 이름입니다. 개발자라는 진로를 선택한 결심, 그리고 선택한 방향으로 계속 나아가려는 태도를 ARCHIVE V1에 담았습니다.",
  },
  {
    id: "favorite-example", category: "favorite", isExample: true,
    title: "조용한 카페, 손으로 적는 메모",
    description: "차분한 공간에서 생각을 정리하고, 떠오르는 아이디어를 노트에 적는 시간을 좋아합니다.",
  },
  {
    id: "interest-example", category: "interest", isExample: true,
    title: "일상에 가까운 AI와 사용자 경험",
    description: "새로운 기술이 사람들이 겪는 작은 불편을 어떻게 줄일 수 있는지에 관심이 있습니다.",
  },
  {
    id: "quote-example", category: "quote", isExample: true,
    title: "작게 시작하고, 끝까지 완성하기.",
    description: "생각을 작은 결과물로 옮기고, 직접 사용해 보며 다음 걸음을 찾자는 문구입니다.",
  },
  {
    id: "goal-example", category: "goal", isExample: true,
    title: "다시 찾고 싶은 서비스를 만드는 개발자",
    description: "기능을 구현하는 데서 나아가, 사용자가 편하게 쓰고 다시 찾는 서비스를 만드는 것이 목표입니다.",
  },
  {
    id: "attitude-example", category: "attitude", isExample: true,
    title: "먼저 듣고, 약속한 일은 마무리하기",
    description: "함께하는 사람의 의견을 충분히 듣고, 맡은 일의 진행 상황을 공유하며 끝까지 책임지는 태도를 중요하게 생각합니다.",
  },
];
