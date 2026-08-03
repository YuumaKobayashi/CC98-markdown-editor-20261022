import type { TopicContentType } from "./enums";

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
  isAnonymous: boolean;
  /**
   * 主题的标题
   */
  title: string;
  /**
   * 主题被点击的次数（阅读数）的原始值
   */
  hitCount: number;
  /**
   * 主题被点击的次数（阅读数），数量较多时显示为带“万”的字符串
   */
  displayHitCount: number | string;
  /**
   * 主题的ID值
   */
  id: number;
  /**
   * 主题所在的版面的编号
   */
  boardId: number;
  /**
   * 主题所在的版面的名称
   */
  boardName: string;
  /**
   * 主题的回复数（不包括第一次发言）的原始值
   */
  replyCount: number;
  /**
   * 主题的回复数（不包括第一次发言），数量较多时显示为带“万”的字符串
   */
  displayReplyCount: number | string;
  /**
   * 主题的楼层数
   */
  floorCount: number;
  /**
   * 主题作者的id。如果主题为匿名主题，则该参数为 null
   */
  userId: number | null;
  /**
   * 主题作者的用户名。匿名主题使用匿名展示名
   */
  userName: string;
  /**
   * 主题作者的头像的图片url地址
   */
  portraitUrl: string;
  /**
   * 主题的原始创建时间
   */
  time: string;
  /**
   * 主题的展示创建时间
   */
  displayTime: string;
  /**
   * 主题被赞的次数
   */
  likeCount?: number;
  /**
   * 主题被踩的次数
   */
  dislikeCount?: number;
  /**
   * 最后回复用户
   */
  lastPostUser: string | null;
  /**
   * 最后回复的原始时间
   */
  lastPostTime: string;
  /**
   * 最后回复的展示时间
   */
  displayLastPostTime: string;
  /**
   * 标签1的原始 ID
   */
  tag1?: number;
  /**
   * 标签1的展示名称
   */
  tag1Name: string | null;
  /**
   * 标签2的原始 ID
   */
  tag2?: number;
  /**
   * 标签2的展示名称
   */
  tag2Name: string | null;
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
  userName?: string | null;
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
  content?: string;
  /**
   * 获得赞数
   */
  likeCount?: number;
  /**
   * 获得踩数
   */
  dislikeCount?: number;
}
