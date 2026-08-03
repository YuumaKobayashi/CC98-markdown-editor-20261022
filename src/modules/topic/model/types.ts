import type {
  TopicContentType,
  TopicState,
  TopicType,
} from "./enums";
import type { TopicInfo } from "./dto";

export type {
  ITopic,
  LotteryTopicDetail,
  SearchedTopicInfo,
  TopicHighlightInfo,
  TopicInfo,
  UserBrowsingTopicInfo,
} from "./dto";
export type { UserRecentTopic } from "./view-model";

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

export interface TopicBasicLookupFallback {
  id: number;
  title: string;
  boardId: number;
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

/**
* 媒体主题帖里的媒体摘要信息
*/
export interface MediaTopicContent {
  /**
   * 缩略图：用于图片、视频和音频类型的主题帖
   */
  thumbnail: string[];
  /**
   * 时长：用于视频和音频类型的主题帖
   */
  duration: number;
  /**
   * 高度：用于视频类型的主题帖
   */
  height: number;
  /**
   * 宽度：用于视频类型的主题帖
   */
  width: number;
  audio: string;
  video: string;
}

/**
 * 表示我关注的某个版面的某个帖子
 */
export interface FocusTopic {
  /**
   * 是否匿名。
   */
  isAnonymous?: boolean;
  /**
  *主题的标题
  */
  title: string;
  /**
  *主题被点击的次数（阅读数）,由于太多，所以显示字符串k
  */
  hitCount: number | string;
  /**
  *主题的ID值
  */
  id: number;
  /**
  *主题所在的版面的编号
  */
  boardId: number;
  /**
 *主题所在的版面的名称
 */
  boardName: string;
  /**
  *主题的回复数（不包括第一次发言），由于太多，所以显示字符串k
  */
  replyCount: number | string;
  /**
 *主题的楼层数
 */
  floorCount: number;
  /**
  *主题作者的id。如果主题为匿名主题，则该参数为 null
  */
  userId: number | null;
  /**
  *主题作者的用户名。如果主题为匿名主题，则该参数为 null
  */
  userName: string;
  /**
  *主题作者的头像的图片url地址
  */
  portraitUrl: string;
  /**
  *主题的创建时间
  */
  time: string;
  /**
  *主题被赞的次数
  */
  likeCount: number;
  /**
  *主题被踩的次数
  */
  dislikeCount: number;
  /**
  *最后回复用户
  */
  lastPostUser: string | null;
  /**
  *最后回复时间
  */
  lastPostTime: string;
  /**
  *标签1
  */
  tag1: number | string | false;
  /**
  *标签2
  */
  tag2: number | string | false;
  /**
   * 媒体主题的摘要信息
   */
  mediaContent: MediaTopicContent | null;
  /**
   * 主题内容的类型
   */
  contentType: TopicContentType;
}

/**
 * 可能错过帖子的信息
 */
/**
 * 表示推荐主题帖
 */
export interface RecommendedTopic {
  /**
   * 主题帖信息
   */
  topic: FocusTopic;
  /**
   * 推荐语（一般为内容摘要）
   */
  content: string;

  /**
   * 旧 service 在大于十万阅读数分支中写入的兼容字段。
   */
  hitCount?: string;

  /**
   * 旧合并逻辑会读取 wrapper id，wire 上并不存在。
   */
  id?: number;
}
