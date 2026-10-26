import type { BoardTagInfoV2Item } from "@modules/board/model/dto";

export interface EditorVoteInfo {
  voteItems: string[];
  expiredDays: number;
  maxVoteCount: number;
  needVote: boolean;
}

export interface EditorTagInfo {
  layers: number;
  tags: BoardTagInfoV2Item[];
}
