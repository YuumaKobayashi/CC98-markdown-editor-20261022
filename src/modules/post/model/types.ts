import type { LikeState, PostContentType, PostState } from "./enums";

export interface IAward {
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
  reason: string;
  /**
   * 时间
   */
  time: Date;
  /**
   * 类型
   */
  type: number;
  /**
   * TODO:
   */
  id: number;
}

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

export interface IPost {
  allowedViewers: any;

  awardInfo: any;
  /**
   * 风评
   */
  awards: IAward[];
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

  isBest: boolean;
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
  lastUpdateAuthor: any;
  /**
   * 最后更新时间
   */
  lastUpdateTime: any;
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
  /**
   * 总楼层数
   */
  length: number;

  parentId: number;

  state: PostState;
  /**
   * 回复时间
   */
  time: string;
  /**
   * 帖子标题
   */
  title: string;
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
  userId: number;
  /**
   * 用户名
   */
  userName: string;
}

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
