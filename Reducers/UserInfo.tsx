// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as ActionTypes from "../ActionTypes";
import * as Appstate from "../States/AppState";
import { RootAction } from "../Store";
import { getMyInfo } from "@modules/session";

/**
 * 用户中心用Store
 */
export class UserInfoStore {
  /**
   * 当前组件是否正在加载
   */
  isLoading: boolean = false;
  /**
   * 表示当前访问的用户页的页面状态
   */
  currentVisitingUserPage: "exact" | "manage" = "exact";
  /**
   * 表示当前访问的用户的id
   */
  currentVisitingUserId: number = 0;
  /*
   * 表示当前访问的用户是否存在
   */
  currentVisitingUserIsExisted: boolean = true;
  /**
   *  用户我的足迹的主题
   */
  currentMyHistoryTopics: Appstate.UserRecentTopic[] = [];
  /**
   * 用户是否启用我的足迹
   */
  browsingHistoryEnabled: boolean = false;
  /**
   * 用户中心是否加载出错
   */
  isError: boolean = false;
  /**
   * 错误信息
   */
  errorMessage: string = "";
  /**
   * 分页信息是否全部加载完
   */
  hasTotal: hasTotal = new hasTotal();
  /**
   * 分页信息总数
   */
  totalPage = new TotalPage();
  /**
   * 当前用户粉丝的用户信息数组
   */
  currentUserFansInfo: Appstate.UserInfo[] = [];
  /**
   * 当前用户关注的用户信息数组
   */
  currentUserFollowingInfo: Appstate.UserInfo[] = [];
  /**
   * 当前用户所在的页面
   */
  currentUserCenterPage:
    | "profile"
    | "config"
    | "mytopics"
    | "myposts"
    | "myfollowings"
    | "myhistory"
    | "myfans" = "profile";
  /**
   * 转账成功的用户名数组
   */
  transferSuccessUsers: string[] = [];

  constructor() {
    const currentUserInfo = getMyInfo() || new Appstate.UserInfo();
    this.totalPage.myfollowings = Math.ceil(
      currentUserInfo.followCount / 10
    );
    this.totalPage.myfans = Math.ceil(currentUserInfo.fanCount / 10);
  }
}

class hasTotal {
  myhistory: boolean = true;
  myfollowings: boolean = true;
  myfans: boolean = true;
}

class TotalPage {
  myhistory: number;
  myfollowings: number;
  myfans: number;
}

/**
 * reducer接收到undefined的state时一定要初始化state
 * 这里用ES6方法，在函数定义中初始化state
 */
export default (
  state = new UserInfoStore(),
  action: RootAction
): UserInfoStore => {
  switch (action.type) {
    case ActionTypes.RESET_USER_INFO_AFTER_LOGIN:
      // 原 USER_LOG_ON 会重建尚未迁移的用户中心页面状态。
      return { ...state, ...new UserInfoStore() };
    case ActionTypes.CHANGE_VISITING_USER:
      return {
        ...state,
        currentVisitingUserPage: action.payload.page,
        currentVisitingUserId: action.payload.id,
      };
    case ActionTypes.USER_LOOKUP_STARTED:
      return { ...state, currentVisitingUserIsExisted: true };
    case ActionTypes.USER_NOT_FOUND:
      return { ...state, currentVisitingUserIsExisted: false };
    case ActionTypes.USER_CENTER_LOADING:
      return { ...state, isLoading: true, isError: false };
    case ActionTypes.USER_CENTER_LOADED:
      return { ...state, isLoading: false };
    case ActionTypes.USER_CENTER_FETCH_ERROR:
      return { ...state, isError: true, errorMessage: action.payload.message };
    case ActionTypes.USER_CENTER_PAGE_LOAD_FINISH:
      return {
        ...state,
        hasTotal: {
          ...state.hasTotal,
          [state.currentUserCenterPage]: true,
        },
        totalPage: {
          ...state.totalPage,
          [state.currentUserCenterPage]: action.payload.totalPage,
        },
      };
    case ActionTypes.CHANGE_USER_FANS_INFO:
      return { ...state, currentUserFansInfo: action.payload.fansInfo };
    case ActionTypes.CHANGE_USER_FOLLOWINGS_INFO:
      return {
        ...state,
        currentUserFollowingInfo: action.payload.followingsInfo,
      };
    case ActionTypes.CHNAGE_USER_CENTER_PAGE:
      return { ...state, currentUserCenterPage: action.payload.page };
    case ActionTypes.USER_CENTER_FOLLOW_USER: {
      let userFollowingInfo = state.currentUserFollowingInfo;
      let currentUserFollowingInfo: Appstate.UserInfo[] = userFollowingInfo.map(
        (item) =>
          item.id === action.payload.userId
            ? { ...item, isFollowing: true }
            : item
      );
      let userFansInfo = state.currentUserFansInfo;
      let currentUserFansInfo: Appstate.UserInfo[] = userFansInfo.map((item) =>
        item.id === action.payload.userId
          ? { ...item, isFollowing: true }
          : item
      );
      return { ...state, currentUserFollowingInfo, currentUserFansInfo };
    }
    case ActionTypes.USER_CENTER_UNFOLLOW_USER: {
      let userFollowingInfo = state.currentUserFollowingInfo;
      let currentUserFollowingInfo: Appstate.UserInfo[] = userFollowingInfo.map(
        (item) =>
          item.id === action.payload.userId
            ? { ...item, isFollowing: false }
            : item
      );
      let userFansInfo = state.currentUserFansInfo;
      let currentUserFansInfo: Appstate.UserInfo[] = userFansInfo.map((item) =>
        item.id === action.payload.userId
          ? { ...item, isFollowing: false }
          : item
      );
      return { ...state, currentUserFollowingInfo, currentUserFansInfo };
    }
    case ActionTypes.USER_CENTER_SOLVE_ERROR:
      return { ...state, errorMessage: "", isError: false };
    case ActionTypes.USER_CENTER_TRANSFER_WEALTH_SUCCESS:
      return { ...state, transferSuccessUsers: action.payload.userNames };
    default:
      return state;
  }
};
