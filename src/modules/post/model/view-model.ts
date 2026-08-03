import type { UserInfo, UserLookupFallback } from "@modules/user";
import type { PostInfo } from "./dto";

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
  postId?: number;
  userInfo: UserInfo | UserLookupFallback | AnonymousPostUserInfo;
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
  title: string | null;
  /**
   * 用户名
   */
  userName: string | null;
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
