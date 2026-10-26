export type {
  BoardBestSaveTopicsInfo,
  IBasicTopic,
  IHotTopic,
  ITag,
  ITagGroup,
  TopicInfo,
  LotteryTopicDetail,
  RecommendedTopicInfo,
  SearchedTopicInfo,
  TagTopicsInfo,
  TopicBasicInfo,
  TopicHighlightInfo,
  UserBrowsingTopicInfo,
  VoteInfo,
  VoteItem,
  VoteRecord,
} from "./dto";
export type {
  FocusTopic,
  MediaTopicContent,
  RecommendedTopic,
  UserRecentTopic,
} from "./view-model";

export interface TopicBasicLookupFallback {
  id: number;
  title: string;
  boardId: number;
}
