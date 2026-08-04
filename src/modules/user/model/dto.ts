import type { ThemeSetting } from "@modules/user-preference/model/dto";

export enum UserGender {
  Male = 1,
  Female = 0,
}

export enum UserState {
  Normal = 0,
  Locked = 1,
  Shielded = 2,
  StopPost = 3,
}

export enum UserTopicViewMode {
  Classic = 0,
  Card = 1,
  CardMediaOnly = 2,
}

export enum TargetWindow {
  CurrentWindow = 0,
  NewWindow = 1,
}

export enum UserRateState {
  None = 0,
  Warning = 1,
  Stop30Days = 2,
  StopPermanent = 3,
}

export enum UserAllowWechatNotifyState {
  Reject = 0,
  Allow = 1,
  Unknown = 2,
}

export enum UserBirthdayPrivacyMode {
  HideAll = 0,
  ShowAll = 1,
  Year = 2,
  YearAndMonth = 3,
  MonthAndDay = 4,
}

export enum ForumUserOperationType {
  Cancel = 0,
  Do = 1,
}

export interface UserTitleDto {
  id: number;
  name: string;
  type: number;
  sortOrder: number;
  iconUri: string;
}

export interface PortraitStyleDto {
  width?: string;
  height?: string;
  position?: "absolute";
  left?: string;
  top?: string;
  zIndex?: string;
}

export interface PortraitConfigItemDto {
  style: PortraitStyleDto;
  imageUrl: string;
  portraitShadow: boolean;
}

export type PortraitConfigDto = Record<string, PortraitConfigItemDto>;

export interface UserBasicInfo {
  /**
   * 用户 ID
   */
  id: number;
  /**
   * 用户名
   */
  name: string;
  /**
   * 头像地址
   */
  portraitUrl: string | null;
}

export interface UserBoardMasterInfo {
  userId: number;
  userName: string;
  boardId: number;
  boardName: string;
  title: string;
  boardMasterLevel: number;
}

export interface UserActivityPointInfo {
  userId: number;
  month: number;
  like: number;
  topic: number;
  post: number;
  rate: number;
  bonus: number;
  rawPoint: number;
  historyPoint: number;
  coefficient: number;
  point: number;
}

export interface UserPrivacySetting {
  birthdayPrivacyMode: UserBirthdayPrivacyMode;
  qqIsProtected: boolean;
  emailAddressIsProtected: boolean;
}

/**
 * 用户信息
 */
export interface UserInfo {
  /**
   * 用户名
   */
  name: string;
  /**
   * 用户性别
   * 男：1
   * 女：0
   */
  gender: UserGender;
  /**
   * 用户生日
   */
  birthday: string | null;
  /**
   * 用户个人简介
   */
  introduction: string | null;
  /**
   * 用户签名档 / 个性签名
   */
  signatureCode: string | null;
  /**
   * 用户 ID
   */
  id: number;
  /**
   * 当前用户是否关注了该用户
   */
  isFollowing: boolean;
  /**
   * 邮箱地址
   */
  emailAddress: string | null;
  /**
   * qq
   */
  qq: string | null;
  /**
   * 发帖数
   */
  postCount: number;
  /**
   * 威望
   */
  prestige: number;
  /**
   * 显示的用户组
   */
  groupName: string | null;
  /**
   * 全站权限等级
   */
  privilege: string | null;
  /**
   * 注册时间
   */
  registerTime: string;
  /**
   * 最后登录时间
   */
  lastLogOnTime: string;
  /**
   * 用户锁定状态，0正常  1锁定  2屏蔽  3全站TP
   */
  lockState: UserState;
  /**
   * 风评
   */
  popularity: number;
  /**
   * 用户拥有的头衔 ID 们
   */
  userTitleIds: number[];
  /**
   * 当前显示的头衔 ID
   */
  displayTitleId: number | null;
  /**
   * 粉丝数
   */
  fanCount: number;
  /**
   * 财富值
   */
  wealth: number;
  /**
   * 用户头像地址
   */
  portraitUrl: string | null;
  /**
   * 用户关注的版面 ID 数组
   */
  customBoards: number[];
  /**
   * 用户关注数
   */
  followCount: number;
  /**
   * 用户选择的主题
   */
  theme: number;
  /**
   * 等级（已经废弃）
   */
  levelTitle: string | null;
  /**
   * 用户版主头衔信息
   */
  boardMasterTitles: UserBoardMasterInfo[];
  /**
   * 被删除的数量
   */
  deleteCount: number;
  /**
   * 用户是否已经通过验证。
   */
  isVerified: boolean;
  /**
   * 获得的赞
   */
  receivedLikeCount: number;

  /**
   * 用户最后登录的 IP 地址。
   */
  lastIpAddress: string | null;

  /**
   * 用户绑定的手机号。
   */
  phoneNumber: string | null;

  /**
   * 用户是否绑定手机。
   */
  hasPhoneNumber: boolean;

  /**
   * 当前小程序状态。
   */
  isSUser: number;

  /**
   * 网页版新页面打开方式。
   */
  targetWindow: TargetWindow;

  /**
   * 用户月活跃度积分。
   */
  activityPoint: UserActivityPointInfo | null;

  /**
   * 用户评分权限。
   */
  rateState: UserRateState;

  /**
   * 是否为 2020 新生。
   */
  isFreshMan: boolean;

  /**
   * 用户的数字水印 ID。
   */
  watermarkId: string | null;

  /**
   * 用户是否允许微信通知。
   */
  allowWechatNotify: UserAllowWechatNotifyState;

  /**
   * 用户的主题设置。
   */
  themeSetting: ThemeSetting;

  /**
   * 用户的隐私设置。
   */
  privacySetting: UserPrivacySetting;

  /**
   * 用户的主题列表浏览模式设置。
   */
  topicViewMode: UserTopicViewMode;

  /**
   * 用户被版面TP的数量。
   */
  stopPostBoardCount: number;
  /**
   * 用户拥有的补签卡
   */
  signInCardCount: number;
  /**
   * 用户是否开启我的足迹功能
   */
  browsingHistoryEnabled: boolean;
}

/**
 * 修改用户信息所要提交的body
 */
export interface ChangeUserInfo {
  /**
   * 性别 男=1 女=0
   */
  Gender: UserGender;
  /**
   * QQ
   */
  QQ: string;
  /**
   * 邮箱地址
   */
  EmailAddress: string;
  /**
   * 个性签名
   */
  SignatureCode: string;
  /**
   * 个人简介
   */
  Introduction: string;
  /**
   * 生日
   */
  Birthday: string;
  /**
   *
   */
  DisplayTitleId: number;
}
