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
   * 用户中心是否加载出错
   */
  isError: boolean = false;
  /**
   * 错误信息
   */
  errorMessage: string = "";
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
      // 原 USER_LOG_ON 会重建尚未迁移的用户中心错误状态。
      return { ...state, ...new UserInfoStore() };
    case ActionTypes.USER_CENTER_FETCH_ERROR:
      return { ...state, isError: true, errorMessage: action.payload.message };
    default:
      return state;
  }
};
