import type { Dispatch } from "redux";

import { changeTheme } from "@foundation/theme/runtime";
import {
  clearInteractiveSession,
  writeCurrentUser,
} from "../persistence/session-persistence";
import {
  currentUserReceived,
  sessionAuthenticated,
  sessionInvalidated,
} from "./session-slice";
import type { CurrentUser } from "./types";

/**
 * 持久化当前用户并立即更新当前标签页。localStorage 的 storage 事件不会
 * 回发给写入它的标签页，因此这两个步骤不能依赖 CrossTabSync 串联。
 */
export function updateCurrentUser(currentUser: CurrentUser) {
  return (dispatch: Dispatch): CurrentUser => {
    writeCurrentUser(currentUser);
    dispatch(currentUserReceived(currentUser));
    return currentUser;
  };
}

/** 接收其他标签页已经持久化的用户，不重复写 localStorage。 */
export function restoreSession(currentUser: CurrentUser) {
  return (dispatch: Dispatch): CurrentUser => {
    dispatch(currentUserReceived(currentUser));
    dispatch(sessionAuthenticated());
    return currentUser;
  };
}

/** 主动退出登录；页面跳转仍由 Application 调用方决定。 */
export function logOut() {
  return (dispatch: Dispatch): void => {
    clearInteractiveSession();
    changeTheme(0);
    dispatch(sessionInvalidated());
  };
}
