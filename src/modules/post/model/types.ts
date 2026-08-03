import type { LikeState } from "./enums";
import type { PostAward } from "./dto";

export type {
  IPost,
  NewPostInfo,
  PostAward,
  PostBasicInfo,
  PostInfo,
  PostLikeInfo,
  SpecificUserPostInfo,
} from "./dto";
export type {
  AnonymousPostUserInfo,
  PostViewModel,
  UserRecentPost,
} from "./view-model";

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
