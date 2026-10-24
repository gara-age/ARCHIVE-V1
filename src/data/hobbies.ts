import type { ArchivePhoto } from "./photos";
export type Hobby = {
  id: string; name: string; category: "experience" | "hobby" | "talent";
  organization: string | null; period: string | null;
  description: string; tasks: string[]; photos: ArchivePhoto[]; reflection: string | null;
};
export const hobbies: Hobby[] = [{
  id: "baking", name: "제과·제빵", category: "experience",
  organization: "㈜안스베이커리", period: "2019.04 — 2019.11",
  description: "소프트웨어 분야로 나아오기 전, 제과·제빵사로 일했습니다. 손으로 결과물을 만들던 시간도 지금의 저를 이루는 경험입니다.",
  tasks: ["제과·제빵"], photos: [], reflection: null,
}];
