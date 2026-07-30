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
  tags: any[];
}
