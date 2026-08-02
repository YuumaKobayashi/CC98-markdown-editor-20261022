import type { AnonymousState, BoardInternalState } from "./enums";

/**
 * 版面合同。
 */
export interface IBoard {
  /**
   * 版面id
   */
  id: number;
  /**
   * 版面名称
   */
  name: string;
  /**
   * 版面名称
   */
  description: string;
  /**
   * 发帖总数
   */
  topicCount: number;
  /**
   * 回复总数
   */
  postCount: number;
  /**
   * 今日回复总数
   */
  todayCount: number;
  /**
   * 版主
   */
  boardMasters: string[];
  /**
   * 是否关注
   */
  isUserCustomBoard?: boolean;
  /**
   * 是否仅内网可见
   */
  internalState: BoardInternalState;
  /**
   * 是否已锁定
   */
  isLock: boolean;
  /**
   * 父版面id
   */
  parentId: number;
  /**
   * 是否匿名
   */
  anonymousState: AnonymousState;

  /**
   * 是否能进入
   */
  canEntry: boolean;
  /**
   * 是否能投票
   */
  canVote: boolean;
  /**
   * 大字报
   */
  bigPaper: string;
}

export interface IBoardGroup {
  /**
   * 版面id
   */
  id: number;
  /**
   * 主管
   */
  masters: string[];
  /**
   * 版面名称
   */
  name: string;
  /**
   * 排序
   */
  order: number;
  /**
   * 子版面
   */
  boards: IBoard[];
}

export interface IBoardMasterTitle {
  /**
   * 用户id
   */
  userId: number;
  /**
   * 用户名
   */
  userName: string;
  /**
   * 版面id
   */
  boardId: number;
  /**
   * 版面名
   */
  boardName: string;
  /**
   * 头衔名
   */
  title: string;
  /**
   * FIXME: 不知道有什么用
   */
  /**
   * 不知道有什么用
   */
  boardMasterLevel: number;
}

/**
 * 表示我关注的某个版面
 */
// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
export interface FocusBoard {
  //版面ID
  id: number;
  //版面名称
  name: string;
  //后续可能有版其他属性
}

/**
 * 用户收藏的版面信息
 */
export interface UserFavoritesBoardInfo {
  /**
   * 版主名数组
   */
  boardMasters: string[];
  /**
   * 今日主题
   */
  todayCount: number;
  /**
   * 总主题
   */
  topicCount: number;
  /**
   * ID
   */
  id: number;
  /**
   * 版面名
   */
  name: string;
}
