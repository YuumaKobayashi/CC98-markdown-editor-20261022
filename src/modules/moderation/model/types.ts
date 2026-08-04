import type { ResultWithCount } from "@foundation/api/contracts";
import type { BoardEvent } from "@modules/board/model/dto";

export interface PostSimpleInfo {
  floor: number;
  userId: number;
  userName: string;
  content: string;
}

export interface PostWithIpInfo {
  ip: string;
  posts: PostSimpleInfo[];
}

export type TopicManageHistory = ResultWithCount<BoardEvent>;

export type ModerationResult =
  | "ok"
  | "unauthorized"
  | "not found"
  | "server error";
