import type {
  LotteryMode,
  LotteryTopicStatus,
  TopicAllowedViewerState,
  TopicBestState,
  TopicContentType,
  TopicSpecialStyle,
  TopicState,
  TopicTopState,
  TopicType,
} from "./enums";
import type { UserInfo } from "@modules/user/model/dto";

export interface TopicHighlightInfo {
  isBold: boolean;
  isItalic: boolean;
  color: string;
}

export interface LotteryTopicDetail {
  status: LotteryTopicStatus;
  result: string | null;
  resultFloor: number | null;
  drawingCount: number;
  drawingTime: string;
  mode: LotteryMode;
}

export interface TopicInfo {
  /**
   * 帖子 ID
   */
  id: number;
  /**
   * 版面 ID
   */
  boardId: number;
  /**
   * 标题
   */
  title: string;
  /**
   * 发布时间
   * 格式: 2018-10-10T01:43:26.11+08:00
   */
  time: string;
  /**
   * 发布者 ID
   */
  userId: number | null;
  /**
   * 发布者用户名
   */
  userName: string | null;

  /**
   * 后端 TopicInfo 嵌入的用户信息。
   */
  userInfo: UserInfo | null;
  /**
   * 是否匿名
   */
  isAnonymous: boolean;
  /**
   * 不上十大
   */
  disableHot: boolean;
  /**
   * 最后回复时间
   */
  lastPostTime: string;

  state: TopicState;

  type: TopicType;
  /**
   * 回复数
   */
  replyCount: number;
  /**
   * 点击数
   */
  hitCount: number;

  totalVoteUserCount: number;
  /**
   * 最后回复用户用户名
   */
  lastPostUser: string | null;
  /**
   * 最后回复内容
   */
  lastPostContent: string | null;
  topState: TopicTopState;
  bestState: TopicBestState;
  /**
   * 是否是投票
   */
  isVote: boolean;

  isPosterOnly: boolean;

  allowedViewerState: TopicAllowedViewerState;
  /**
   * 赞同数
   */
  likeCount: number;
  /**
   * 反对数量
   */
  dislikeCount: number;

  highlightInfo: TopicHighlightInfo | null;

  tag1: number;

  tag2: number;

  isInternalOnly: boolean;

  notifyPoster: boolean;

  isMe: boolean;

  todayCount: number;

  allowHotReply: boolean;

  contentType: TopicContentType;

  favoriteCount: number;

  topicAuthorPermissions: string[];

  mediaContent: unknown;

  specialStyle: TopicSpecialStyle;

  notifyAllReplierCountByLZ: number;

  lastNotifyAllReplierFloorByLZ: number;

  canNotifyAllReplier: boolean;

  notifyAllReplierPostIds: number[];

  isHotTopic: boolean;

  lotteryTopicDetail: LotteryTopicDetail | null;
}

export interface SearchedTopicInfo {
  id: number;
  boardId: number;
  boardName: string;
  title: string;
  time: string;
  userId: number | null;
  userName: string | null;
  isAnonymous: boolean;
  replyCount: number;
  hitCount: number;
  lastPostUser: string;
  lastPostTime: string;
  lastPostContent: string;
  mediaContent: unknown;
  contentType: TopicContentType;
  state: TopicState;
}

export interface UserBrowsingTopicInfo extends SearchedTopicInfo {
  lastBrowsingTime: string;
}

/**
 * 帖子基础合同。
 */
export interface TopicBasicInfo {
  /**
   * 帖子id
   */
  id: number;
  /**
   * 主题标题
   */
  title: string;
  /**
   * 版面id
   */
  boardId: number;
  /**
   * 是否内网可见
   */
  isInternalOnly: boolean;
  /**
   * 是否投票贴
   */
  isVote: boolean;
  /**
   * 帖子状态
   */
  status: TopicState;
  /**
   * 帖子类型
   */
  type: TopicType;

  contentType: TopicContentType;
}

export type IBasicTopic = TopicBasicInfo;

export interface IHotTopic {
  /**
   * 作者名
   */
  authorName: string;
  /**
   * 版面 ID
   */
  boardId: number;
  /**
   * 版面名
   */
  boardName: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 点击数
   */
  hitCount: number;
  /**
   * ID
   */
  id: number;
  /**
   * 参与者数量
   */
  participantCount: number;
  /**
   * 回复数
   */
  replyCount: number;
  /**
   * 标题
   */
  title: string;
  /**
   * 帖子类型
   * 0 普通帖子  1 校园活动  2 学术通知
   */
  type: TopicType;
}

export interface ITag {
  id: number;
  name: string;
}

export interface ITagGroup {
  layer: number;
  tags: ITag[];
}

export interface VoteItem {
  id: number;
  description: string;
  count: number;
}

export interface VoteRecord {
  userId: number;
  userName: string;
  items: number[];
  ip: string;
  time: string;
}

export interface VoteInfo {
  topicId: number;
  voteItems: VoteItem[];
  voteRecords: VoteRecord[] | null;
  expiredTime: string;
  isAvailable: boolean;
  maxVoteCount: number;
  canVote: boolean;
  myRecord: VoteRecord | null;
  needVote: boolean;
  voteUserCount: number;
}

export interface RecommendedTopicInfo {
  topic: TopicInfo;
  content: string;
}

export interface BoardBestSaveTopicsInfo {
  count: number;
  topics: TopicInfo[];
}

export interface TagTopicsInfo {
  count: number;
  topics: TopicInfo[];
}
