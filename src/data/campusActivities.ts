import type { ArchivePhoto } from "./photos";
export type CampusActivity = {
  id: string;
  title: string;
  organization: string;
  period: string | null;
  role: string;
  tasks: string[];
  photos: ArchivePhoto[];
  materials: { label: string; href: string }[];
  learning: string | null;
};
// Activity names and roles are supplied by the user. Dates, outcomes and anecdotes remain unfilled.
export const campusActivities: CampusActivity[] = [
  {
    id: "promotion", title: "학과 홍보 근로장학생",
    organization: "한국폴리텍대학 인천캠퍼스 AI융합소프트웨어과",
    period: null, role: "학과 홍보 관련 근로장학생",
    tasks: ["학과 홍보 활동"], photos: [], materials: [], learning: null,
  },
  {
    id: "faculty", title: "교수 업무 보조",
    organization: "한국폴리텍대학 인천캠퍼스 AI융합소프트웨어과",
    period: null, role: "학과 및 교수 업무 지원",
    tasks: ["학과 및 교수 업무 보조"], photos: [], materials: [], learning: null,
  },
  {
    id: "events", title: "학생 인솔 및 행사 지원",
    organization: "한국폴리텍대학 인천캠퍼스 AI융합소프트웨어과",
    period: null, role: "학생 인솔 · 교내외 행사 지원",
    tasks: ["학생 인솔", "교내외 행사 지원"], photos: [], materials: [], learning: null,
  },
];
