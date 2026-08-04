import type { RatingType } from "@modules/post/model/enums";

export interface RatingReason {
  id: number;
  reason: string;
  type: RatingType;
  enabled: boolean;
}

export type PostOperationResult =
  | "ok"
  | "limited"
  | "wrong input"
  | "unauthorized"
  | "not found"
  | "server error";
