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
