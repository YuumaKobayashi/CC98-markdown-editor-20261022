export enum PostState {
  Normal = 0,
  Deleted = 2,
}

export enum PostContentType {
  Ubb = 0,
  Markdown = 1,
}

export enum LikeState {
  None = 0,
  Like = 1,
  Dislike = 2,
}

export enum PostUserOperationType {
  Bonus = 0,
  Punishment = 1,
}

export enum RatingType {
  Add = 1,
  Subtract = 2,
}

export enum PostAwardType {
  OldVersion = 0,
  Bonus = 1,
  Punishment = 2,
  UserRating = 3,
}

export interface ManagedPostInfo {
  /**
   * 版面ID
   */
  boardId: number;
  /**
   * 回复内容
   */
  content: string;
  /**
   * 回复楼层
   */
  floor: number;
  /**
   * IP地址
   */
  ip: string;
  /**
   * 回复时间
   */
  time: string;
  /**
   * 主题id
   */
  topicId: number;
}

export interface ManagedPostResponse {
  postInfos: ManagedPostInfo[];
  count: number;
}

export interface PostAward {
  /**
   * 操作内容
   */
  content: string;
  /**
   * 操作人
   */
  operatorName: string;
  /**
   * 操作理由
   */
  reason: string | null;
  /**
   * 时间
   */
  time: string;
  /**
   * 类型
   */
  type: PostAwardType;
  /**
   * TODO:
   */
  id: number;

  postId: number;

  deleted: boolean;
}

export interface PostInfo {
  allowedViewers: string[] | null;
  /**
   * 风评
   */
  awards: PostAward[];
  /**
   * 帖子内容
   */
  content: string;
  /**
   * 内容类型
   * UBB 0
   * markdown 1
   */
  contentType: PostContentType;
  /**
   * 楼层数
   */
  floor: number;
  /**
   * post ID
   */
  id: number;
  /**
   * IP
   */
  ip: string;

  isAllowedOnly: boolean;
  /**
   * 是否匿名
   */
  isAnonymous: boolean;

  /**
   * 是否被删除
   */
  isDeleted: boolean;
  /**
   * 是否是楼主（LZ）
   */
  isLZ: boolean;
  /**
   * 最后更新作者
   */
  lastUpdateAuthor: string | null;
  /**
   * 最后更新时间
   */
  lastUpdateTime: string | null;
  /**
   * 赞数量
   */
  likeCount: number;
  /**
   * 踩数量
   */
  dislikeCount: number;
  /**
   * 赞/踩状态
   */
  likeState: LikeState;
  parentId: number;

  state: PostState;
  /**
   * 回复时间
   */
  time: string;
  /**
   * 帖子标题
   */
  title: string | null;
  /**
   * 帖子的 ID
   */
  topicId: number;
  /**
   * 版面 ID
   */
  boardId: number;
  /**
   * 用户 ID
   */
  userId: number | null;
  /**
   * 用户名
   */
  userName: string | null;

  /**
   * 当前用户在特定用户追踪结果中的回帖数。
   */
  count: number;

  /**
   * 该发言是否由当前用户发布。
   */
  isMe: boolean;
}

export interface PostBasicInfo {
  id: number;
  floor: number;
  userId: number;
  userName: string;
  isDeleted: boolean;
  boardId: number;
}

/**
 * 新建或编辑回复时提交给主后端的请求体。
 * 未出现的字段继续由后端默认值处理。
 */
export interface NewPostInfo {
  content: string;
  title?: string | null;
  contentType: PostContentType;
  parentId?: number;
  tag1?: number;
  tag2?: number;
  allowedViewers?: string | null;
  allowedViewerState?: import("@modules/topic/model/dto").TopicAllowedViewerState;
  type?: import("@modules/topic/model/dto").TopicType;
  notifyPoster?: boolean;
  isAnonymous?: boolean;
  notifyAllReplier?: boolean;
  clientType?: number;
}

export interface PostLikeInfo {
  dislikeCount: number;
  likeCount: number;
  likeState: LikeState;
}
