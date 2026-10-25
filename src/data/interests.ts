export type InterestCategory = "favorite" | "interest" | "quote" | "value" | "goal" | "attitude";
export type PersonalInterest = {
  id: string;
  category: InterestCategory;
  title: string;
  description: string;
  items?: { title: string; description?: string }[];
  isExample: boolean;
};
export const interestCategoryLabels: Record<InterestCategory, string> = {
  favorite: "좋아하는 것", interest: "관심 분야", quote: "좋아하는 문구",
  value: "가치관", goal: "개인적인 목표", attitude: "중요하게 생각하는 태도",
};
// Personal content supplied and confirmed by the user. V1 is a personal metaphor for taking action.
export const interests: PersonalInterest[] = [
  {
    id: "v1", category: "value", isExample: false,
    title: "V1 — The Decision to Take Off",
    description: "V1은 첫 번째 버전이면서, 항공의 이륙결심속도에서 영감을 받은 이름입니다. 새로운 배움을 선택하고, 경험을 통해 다음 방향을 만들어 가려는 마음을 ARCHIVE V1에 담았습니다.",
  },
  {
    id: "favorites", category: "favorite", isExample: false,
    title: "분위기 좋은 카페부터 과학까지",
    description: "분위기 좋은 카페, 아름답고 완성도 높은 디자인, 패션, 시, 과학을 좋아합니다.",
  },
  {
    id: "interests", category: "interest", isExample: false,
    title: "새로운 사실과 다양한 분야",
    description: "AI 활용과 새로운 사실을 알아가는 일, 패션과 스타일링, 일본, 제과·제빵에 관심이 있습니다.",
  },
  {
    id: "quote", category: "quote", isExample: false,
    title: "V1 Speed (Decision Speed)",
    description: "이륙결심속도에서 영감을 받은 문구입니다. 도전을 두려워하던 제가 이제는 완벽한 준비만 기다리지 않고, 저의 삶을 위해 새로운 시도를 선택하자는 다짐을 담았습니다.",
  },
  {
    id: "goals", category: "goal", isExample: false,
    title: "스스로에게 당당한 사람 되기",
    description: "남과 비교하기보다 자신의 선택에 책임지고 성장하는 사람이 되고 싶습니다.",
    items: [
      { title: "새로운 경험을 통해 더 넓은 세상을 알아가기" },
      { title: "소중한 사람들과 함께 행복하고 의미 있는 삶을 만들어가기" },
    ],
  },
  {
    id: "attitudes", category: "attitude", isExample: false,
    title: "제가 중요하게 생각하는 다섯 가지 태도",
    description: "",
    items: [
      { title: "책임감과 완수", description: "맡은 일을 끝까지 책임지고, 단순히 완료하는 데서 그치지 않고 결과물의 완성도까지 신경 쓰는 태도." },
      { title: "몰입과 배움", description: "모르는 것을 그냥 넘기지 않고 직접 찾아보고, 이해하고, 적용하면서 실력을 쌓는 태도." },
      { title: "협력과 배려", description: "다른 사람의 어려움을 자신의 일처럼 생각하고, 함께 성장하는 관계를 중요하게 여기는 태도." },
      { title: "도전과 실행", description: "완벽한 준비만 기다리기보다 불확실한 상황에서도 새로운 시도를 선택하는 태도." },
      { title: "진정성과 신뢰", description: "자신을 과장하기보다 실제 경험과 결과로 보여주고, 사람들과의 관계에서도 정직함과 예의를 중요하게 여기는 태도." },
    ],
  },
];
