export type {
  BoardBestSaveTopicsInfo,
  IBasicTopic,
  IHotTopic,
  ITag,
  ITagGroup,
  ITopic,
  LotteryTopicDetail,
  RecommendedTopicInfo,
  SearchedTopicInfo,
  TagTopicsInfo,
  TopicBasicInfo,
  TopicHighlightInfo,
  TopicInfo,
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
