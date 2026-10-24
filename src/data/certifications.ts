export type Certification = {
  name: string;
  kind: "qualification" | "language";
  issuer: string;
  date: string;
  status: "취득 완료" | "1차 합격" | "필기 합격" | "준비 중";
  skills: string[];
  image: string | null;
};
// Preserve the issuer, date and stage of achievement as written in the provided resume.
export const certifications: Certification[] = [
  {
    name: "정보처리산업기사",
    kind: "qualification",
    issuer: "한국산업인력공단",
    date: "2026.09",
    status: "취득 완료",
    skills: [],
    image: null,
  },
  {
    name: "SQL개발자 · SQLD",
    kind: "qualification",
    issuer: "한국데이터베이스진흥센터",
    date: "2025.06",
    status: "취득 완료",
    skills: [],
    image: null,
  },
  {
    name: "리눅스마스터 2급",
    kind: "qualification",
    issuer: "한국정보통신진흥협회",
    date: "2025.08",
    status: "1차 합격",
    skills: [],
    image: null,
  },
  {
    name: "JLPT 3급",
    kind: "language",
    issuer: "일본국제교류기금",
    date: "2025.08",
    status: "취득 완료",
    skills: ["일본어"],
    image: null,
  },
];
export const certificationStatuses = [
  "취득 완료",
  "1차 합격",
  "필기 합격",
  "준비 중",
] as const;
export const academicRecords = [
  {
    title: "AI융합소프트웨어",
    institution: "한국폴리텍2대학(인천캠퍼스)",
    period: "2025.03 ~",
    detail: "2년제 · 재학 중",
  },
];
