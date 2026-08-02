import type { IBoardMasterTitle } from "@modules/board";

export interface IBasicUser {
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
  portraitUrl: string;
}

export interface IUser {
  /**
   * 用户名
   */
  name: string;
  /**
   * 用户性别
   * 男：1
   * 女：0
   */
  gender: 0 | 1;
  /**
   * 用户生日
   */
  birthday: string | null;
  /**
   * 用户个人简介图片
   */
  photourl: string;
  /**
   * 用户个人简介
   */
  introduction: string;
  /**
   * 用户签名档
   */
  signatureCode: string;
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
  emailAddress: string;
  /**
   * QQ
   */
  qq: string;
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
  displayTitle: string;
  /**
   * 全站权限等级
   */
  privilege: string;
  /**
   * 注册时间
   */
  registerTime: string;
  /**
   * 最后登录时间
   */
  lastLogOnTime: string;
  /**
   * 自定义头衔
   */
  customTitle: string;
  /**
   * 用户锁定状态：0正常  1锁定  2屏蔽  3全站TP
   */
  lockState: 0 | 1 | 2 | 3;
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
  displayTitleId: number;
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
  portraitUrl: string;
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
  levelTitle: string;
  /**
   * 用户版主头衔信息
   */
  boardMasterTitles: IBoardMasterTitle[];
  /**
   * 被删除的数量
   */
  deleteCount: number;
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
   */
  gender: 0 | 1;
  /**
   * 用户生日
   */
  birthday: string;
  /**
   * 用户个人简介图片
   */
  photourl: string;
  /**
   * 用户个人简介
   */
  introduction: string;
  /**
   * 用户个性签名
   */
  signatureCode: string;
  /**
   * id
   */
  id: number;
  /**
   * 当前用户是否关注了该用户
   */
  isFollowing: boolean;
  /**
   * 邮箱地址
   */
  emailAddress: string;
  /**
   * qq
   */
  qq: string;
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
  displayTitle: string;
  /**
   * 全站权限等级
   */
  privilege: string;
  /**
   * 注册时间
   */
  registerTime: string;
  /**
   * 最后登录时间
   */
  lastLogOnTime: string;
  /**
   * 自定义头衔
   */
  customTitle: string;
  /**
   * 用户锁定状态，0正常  1锁定  2屏蔽  3全站TP
   */
  lockState: 0 | 1 | 2 | 3;
  /**
   * 风评
   */
  popularity: number;
  /**
   * 用户拥有的头衔ID们
   */
  userTitleIds: number[];
  /**
   * 当前显示的头衔ID
   */
  displayTitleId: number;
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
  portraitUrl: string;
  /**
   * 用户关注的版面id数组
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
   * 等级（已经废弃
   */
  levelTitle: string;
  /**
   * 用户版主头衔信息
   */
  boardMasterTitles: IBoardMasterTitle[];
  /**
   * 被删除的数量
   */
  deleteCount: number;
  /**
   * 获得的赞
   */
  receivedLikeCount: number;

  /**
   * 用户的主题设置。
   */
  themeSetting: import("@modules/user-preference").ThemeSetting;

  /**
   * 用户的主题列表浏览模式设置。
   */
  topicViewMode: 0 | 1 | 2;

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
  Gender: 0 | 1;
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
