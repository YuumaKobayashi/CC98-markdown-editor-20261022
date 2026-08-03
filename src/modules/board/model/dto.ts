import type {
  AnonymousState,
  BoardInternalState,
  BoardPosterOnlyState,
  BoardPrivacyState,
  BoardProtectionLevel,
  ViewerFilterState,
} from "./enums";

export interface BoardSimpleInfo {
  id: number;
  name: string;
  boardMasters: string[];
  topicCount: number;
  postCount: number;
  todayCount: number;
  description: string | null;
  anonymousState: AnonymousState;
  showShareTip: boolean;
  canVote: boolean;
}

export interface BoardCategoryInfo {
  id: number;
  name: string;
  order: number;
  masters: string[];
  boards: BoardSimpleInfo[];
}

/** `/static/boardinfo.json` 中供名称查询使用的精简版面合同。 */
export interface StaticBoardInfo {
  id: number;
  name: string;
}

/**
 * 版面合同。
 */
export interface BoardInfo {
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
  description: string | null;
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
  isUserCustomBoard: boolean;
  /**
   * 是否仅内网可见
   */
  internalState: BoardInternalState;
  /**
   * 是否已锁定
   */
  isLocked: boolean;
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
  bigPaper: string | null;

  logoUri: string | null;

  privacyState: BoardPrivacyState;

  viewerFilterState: ViewerFilterState;

  protectionLevel: BoardProtectionLevel;

  rootId: number;

  lastPostContent: string | null;

  allowPostOnly: BoardPosterOnlyState;

  forbidRvpn: boolean;

  topicAuthorPermissions: string[];

  allowNotifyAllReplier: boolean;

  showShareTip: boolean;
}

export interface BoardTagInfo {
  layer: number;
  tags: Array<{ id: number; name: string }>;
}

export interface BoardTagInfoV2Item {
  id: number;
  name: string;
  subTags: BoardTagInfoV2Item[];
}

export interface BoardTagInfoV2 {
  layers: number;
  tags: BoardTagInfoV2Item[];
}

export interface BoardStopPostUserInfo {
  userId: number;
  userName: string | null;
  expiredTime: string;
  days: number;
  operatorUserName: string;
}

export interface BoardEvent {
  id: number;
  topicId: number;
  boardId: number;
  targetUserName: string | null;
  operatorUserName: string | null;
  content: string;
  time: string;
  ip: string;
  isDeleted: boolean;
  isAnonymous: boolean;
}

export interface BoardEventInfo {
  boardId: number;
  count: number;
  from: number;
  size: number;
  boardEvents: BoardEvent[];
}
