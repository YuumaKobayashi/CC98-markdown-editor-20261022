// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as ActionTypes from "../ActionTypes";
import { RootAction } from "../Store";

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
   * 用户中心是否加载出错
   */
  isError: boolean = false;
  /**
   * 错误信息
   */
  errorMessage: string = "";
  /**
   * 转账成功的用户名数组
   */
  transferSuccessUsers: string[] = [];
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
    case ActionTypes.USER_CENTER_SOLVE_ERROR:
      return { ...state, errorMessage: "", isError: false };
    case ActionTypes.USER_CENTER_TRANSFER_WEALTH_SUCCESS:
      return { ...state, transferSuccessUsers: action.payload.userNames };
    default:
      return state;
  }
};
