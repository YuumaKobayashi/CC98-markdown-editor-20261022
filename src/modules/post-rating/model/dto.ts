import type { RatingType } from "@modules/post/model/dto";

export interface RatingReason {
  id: number;
  reason: string;
  type: RatingType;
  enabled: boolean;
}
