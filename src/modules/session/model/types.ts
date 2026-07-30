export interface CurrentUserThemeSetting {
  enableDayNightSwitch: boolean;
  syncWithBrowserDayNightMode: boolean;
  dayStartTime: string;
  nightStartTime: string;
}

export interface CurrentUserBoardMasterTitle {
  userId: number;
  userName: string;
  boardId: number;
  boardName: string;
  title: string;
  boardMasterLevel: number;
}

/**
 * 当前登录用户的 `/me` 合同。
 *
 * 字段保持与现有 MyInfo 完全一致；Session 在 S1.1 起拥有该合同，
 * 不再通过 legacy AppState 间接声明当前用户类型。
 */
export interface CurrentUser {
  name: string;
  gender: 0 | 1;
  birthday: string;
  photourl: string;
  introduction: string;
  signatureCode: string;
  id: number;
  isFollowing: boolean;
  emailAddress: string;
  qq: string;
  postCount: number;
  prestige: number;
  displayTitle: string;
  privilege: string;
  registerTime: string;
  lastLogOnTime: string;
  customTitle: string;
  lockState: 0 | 1 | 2 | 3;
  popularity: number;
  userTitleIds: number[];
  displayTitleId: number;
  fanCount: number;
  wealth: number;
  portraitUrl: string;
  customBoards: number[];
  followCount: number;
  theme: number;
  levelTitle: string;
  boardMasterTitles: CurrentUserBoardMasterTitle[];
  deleteCount: number;
  receivedLikeCount: number;
  themeSetting: CurrentUserThemeSetting;
  topicViewMode: 0 | 1 | 2;
  stopPostBoardCount: number;
  signInCardCount: number;
  browsingHistoryEnabled: boolean;
  isVerified: boolean;
}

export interface SessionState {
  /**
   * 登录状态必须独立保存。旧流程在登录请求开始时会先变为未登录，
   * 但仍保留上一次的当前用户对象。
   */
  isLogOn: boolean;
  currentUser: CurrentUser;
}
