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
import type { IUser } from "@modules/user";

/**
 * 帖子基础合同。
 */
export interface TopicBasicInfo {
  /**
   * 帖子id
   */
  id: number;
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
   * 后端 TopicInfo 嵌入的用户信息；完整 User wire 统一留待 Phase 3。
   */
  userInfo: IUser | null;
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

/**
 * 旧名兼容别名；实际 wire DTO 为 {@link TopicInfo}。
 */
export type ITopic = TopicInfo;

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
export interface RandomTopic {
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

/**
 * 表示用户最近帖子
 */
export interface UserRecentTopic {
  /**
   * 帖子版面
   */
  boardName: string;
  /**
   * 发帖时间
   */
  time: string;
  /**
   * 帖子标题
   */
  title: string;
  /**
   * 用户名
   */
  userName: string;
  /**
   * 用户名
   */
  isAnonymous: boolean;
  /**
   * 帖子id
   */
  id: number;
  /**
   * 帖子版面id
   */
  boardId: number;
  /**
   * 帖子内容
   */
  content: string;
  /**
   * 获得赞数
   */
  likeCount: number;
  /**
   * 获得踩数
   */
  dislikeCount: number;
}
