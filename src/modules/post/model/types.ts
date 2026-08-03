import type {
  LikeState,
  PostContentType,
} from "./enums";
import type { IUser, UserLookupFallback } from "@modules/user";
import type { PostAward, PostInfo } from "./dto";

export type { IPost, PostAward, PostInfo } from "./dto";
export type { UserRecentPost } from "./view-model";

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
