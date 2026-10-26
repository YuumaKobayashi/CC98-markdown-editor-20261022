import type { Action } from "redux";

import { setLocalStorage, getLocalStorage } from "@foundation/storage/web-storage";
import { formAuthorizeHeader } from "./session";
import { cc98Fetch } from "@foundation/api/http";
import { changeLegacyCurrentUser } from "@foundation/lib/legacy-utility-effects";
import { updateCurrentUser } from "../model/session-actions";
import type { CurrentUser } from "../model/types";

interface SessionDispatch {
  <T>(thunk: (dispatch: SessionDispatch) => T): T;
  <A extends Action>(action: A): A;
}

type SessionThunk<T> = (dispatch: SessionDispatch) => Promise<T>;

/**
 * 刷新当前用户信息
 */
export async function refreshUserInfo(): Promise<CurrentUser | undefined> {
  if (getLocalStorage("refresh_token")) {
    let headers = await formAuthorizeHeader();
    let response = await cc98Fetch(`/me`, {
      headers,
    });

    let userInfo = (await response.json()) as CurrentUser;
    changeLegacyCurrentUser(userInfo);
    setLocalStorage("userInfo", userInfo, 2592000);
    return userInfo;
  }
}

/**
 * 刷新当前用户并由 Session 更新当前标签页。调用方若仍需要 legacy
 * userInfo 的页面级错误或派生字段，应继续经过对应的薄兼容 thunk。
 */
export function refreshCurrentUser(
  beforeUpdate?: (currentUser: CurrentUser) => void
): SessionThunk<CurrentUser> {
  return async (dispatch: SessionDispatch): Promise<CurrentUser> => {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(`/me`, { headers });
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const currentUser = (await response.json()) as CurrentUser;
    beforeUpdate?.(currentUser);
    dispatch(updateCurrentUser(currentUser));
    return currentUser;
  };
}

/**
 * 保留旧 refreshCurrentUserInfo 的页面调用合同。刷新失败时旧 thunk 只写入
 * 已无人读取的 userInfo 错误状态；S1.7 删除该状态后继续静默结束。
 */
export function refreshCurrentUserInfo(): SessionThunk<CurrentUser | undefined> {
  return async (dispatch: SessionDispatch): Promise<CurrentUser | undefined> => {
    try {
      return await dispatch(refreshCurrentUser());
    } catch {
      return undefined;
    }
  };
}
