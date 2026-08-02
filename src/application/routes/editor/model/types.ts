import type { BoardTagInfoV2Item } from "@modules/board";
import type { NewPostInfo, PostContentType } from "@modules/post";
import type { TopicType } from "@modules/topic";

export interface EditorVoteInfo {
  voteItems: string[];
  expiredDays: number;
  maxVoteCount: number;
  needVote: boolean;
}

export interface EditorVoteSettingsProps {
  voteInfo: EditorVoteInfo;
  onVoteInfoChange: (voteInfo: EditorVoteInfo) => void;
}

export interface EditorTagInfo {
  layers: number;
  tags: BoardTagInfoV2Item[];
}

export interface EditorTopicRequest {
  content: string;
  contentType: PostContentType;
  title: string;
  tag1?: number;
  tag2?: number;
  type: TopicType;
  notifyPoster: boolean;
  isAnonymous: boolean;
  clientType: number;
  isVote?: true;
  voteInfo?: EditorVoteInfo;
}

export interface EditorPostRequest
  extends Omit<NewPostInfo, "tag1" | "tag2"> {
  tag1?: number | false;
  tag2?: number | false;
}
