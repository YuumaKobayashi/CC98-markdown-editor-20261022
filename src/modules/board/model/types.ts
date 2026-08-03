import type { BoardInfo } from "./dto";

export type {
  BoardCategoryInfo,
  BoardEvent,
  BoardEventInfo,
  BoardInfo,
  BoardSimpleInfo,
  BoardStopPostUserInfo,
  BoardTagInfo,
  BoardTagInfoV2,
  BoardTagInfoV2Item,
} from "./dto";

/**
 * 旧名兼容别名；实际 wire DTO 为 {@link BoardInfo}。
 */
export type IBoard = BoardInfo;

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
