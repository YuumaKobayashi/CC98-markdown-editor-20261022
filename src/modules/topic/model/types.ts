/**
 * 帖子基础合同。
 */
export interface IBasicTopic {
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
  status: number;
  /**
   * 帖子类型
   */
  type: number;
}

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
  type: number;
}

export interface ITag {
  id: number;
  name: string;
}

export interface ITagGroup {
  layer: number;
  tags: ITag[];
}

export interface ITopic {
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
  userId: number;
  /**
   * 发布者用户名
   */
  userName: string;
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

  state: number;

  type: number;
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
  lastPostUser: string;
  /**
   * 最后回复内容
   */
  lastPostContent: string;
  topState: number;
  bestState: number;
  /**
   * 是否是投票
   */
  isVote: false;

  isPosterOnly: false;

  allowedViewerState: number;
  /**
   * 赞同数
   */
  likeCount: number;
  /**
   * 反对数量
   */
  dislikeCount: number;

  highlightInfo: any;

  tag1: number;

  tag2: number;

  isInternalOnly: boolean;
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
 * 主题内容类型枚举
 */
export enum TopicContentType {
  /**
   * 普通主题帖
   */
  Normal = 0,
  /**
   * 投票主题帖
   */
  VoteTopic = 1,
  /**
   * 视频主题帖
   */
  VideoTopic = 2,
  /**
   * 音频主题帖
   */
  AudioTopic = 3,
  /**
   * 图片主题帖
   */
  ImageTopic = 4,
}

/**
 * 表示我关注的某个版面的某个帖子
 */
export interface FocusTopic {
  /**
  *主题的标题
  */
  title: string;
  /**
  *主题被点击的次数（阅读数）,由于太多，所以显示字符串k
  */
  hitCount: string;
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
  replyCount: string;
  /**
 *主题的楼层数
 */
  floorCount: number;
  /**
  *主题作者的id。如果主题为匿名主题，则该参数为 null
  */
  userId: number;
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
  lastPostUser: string;
  /**
  *最后回复时间
  */
  lastPostTime: string;
  /**
  *标签1
  */
  tag1: string;
  /**
  *标签2
  */
  tag2: string;
  /**
   * 媒体主题的摘要信息
   */
  mediaContent: MediaTopicContent;
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
  hitCount: string;
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
  replyCount: string;
  /**
 *主题的楼层数
 */
  floorCount: number;
  /**
  *主题作者的id。如果主题为匿名主题，则该参数为 null
  */
  userId: number;
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
  lastPostUser: string;
  /**
  *最后回复时间
  */
  lastPostTime: string;
  /**
  *标签1
  */
  tag1: string;
  /**
  *标签2
  */
  tag2: string;
  /**
   * 媒体主题的摘要信息
   */
  mediaContent: MediaTopicContent;
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
