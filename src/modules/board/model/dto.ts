import type { AnonymousState } from "./enums";

export interface BoardSimpleInfo {
  id: number;
  name: string;
  boardMasters: string[];
  topicCount: number;
  postCount: number;
  todayCount: number;
  description: string | null;
  anonymousState: AnonymousState;
  showShareTip: boolean;
  canVote: boolean;
}

export interface BoardCategoryInfo {
  id: number;
  name: string;
  order: number;
  masters: string[];
  boards: BoardSimpleInfo[];
}
