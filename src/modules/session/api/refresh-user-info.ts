import type { Dispatch } from "redux";

import { setLocalStorage, getLocalStorage } from "@foundation/storage/web-storage";
import { formAuthorizeHeader } from "./session";
import { cc98Fetch } from "@foundation/api/http";
import { changeLegacyCurrentUser } from "@foundation/lib/legacy-utility-effects";
import { updateCurrentUser } from "../model/session-actions";
import type { CurrentUser } from "../model/types";

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
) {
  return async (dispatch: Dispatch): Promise<CurrentUser> => {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(`/me`, { headers });
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const currentUser = (await response.json()) as CurrentUser;
    beforeUpdate?.(currentUser);
    dispatch(updateCurrentUser(currentUser) as any);
    return currentUser;
  };
}
