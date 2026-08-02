import type {
  LikeState,
  PostAwardType,
  PostContentType,
  PostState,
} from "./enums";
import type { IUser, UserLookupFallback } from "@modules/user";

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

export type IAward = PostAward;

export type ILikeState = LikeState;

export interface ILike {
  /**
   * 踩数量
   */
  dislikeCount: number;
  /**
   * 赞数量
   */
  likeCount: number;
  /**
   * 赞/踩状态
   */
  likeState: ILikeState;
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
  likeState: ILikeState;
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

/**
 * 旧名兼容别名；实际 wire DTO 为 {@link PostInfo}。
 */
export type IPost = PostInfo;

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
  allowedViewerState?: import("@modules/topic").TopicAllowedViewerState;
  type?: import("@modules/topic").TopicType;
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

export type SpecificUserPostInfo = PostInfo;

export interface AnonymousPostUserInfo {
  name: string;
  portraitUrl: string;
  id: null;
  privilege: string;
  popularity: number;
  signatureCode: string | null;
  postCount: number;
  fanCount?: number;
}

/**
 * topic service 在 PostInfo wire DTO 上追加用户与兼容 postId 后的渲染模型。
 */
export type PostViewModel = PostInfo & {
  postId?: number | string;
  userInfo: IUser | UserLookupFallback | AnonymousPostUserInfo;
};

/**
 * 表示用户最近帖子
 */
export interface UserRecentPost {
  /**
   * 帖子版面
   */
  boardName: string;
  /**
   * 发帖时间
   */
  time: string;
  /**
   * 楼层
   */
  floor: number;
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
   * 回复id
   */
  id: number;
  /**
   * 帖子id
   */
  topicId: number;
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
