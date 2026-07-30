import {
  getLocalStorage,
  removeLocalStorage,
  removeStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

import type { CurrentUser } from "../model/types";

const CURRENT_USER_TTL_SECONDS = 2592000;

export interface PersistedSessionSnapshot {
  currentUser: CurrentUser | null;
  isLogOn: boolean;
}

export function readCurrentUser(): CurrentUser | null {
  return getLocalStorage<CurrentUser>("userInfo") || null;
}

export function writeCurrentUser(currentUser: CurrentUser): void {
  setLocalStorage("userInfo", currentUser, CURRENT_USER_TTL_SECONDS);
}

export function hasRefreshToken(): boolean {
  return !!getLocalStorage<string>("refresh_token");
}

export function readSessionSnapshot(): PersistedSessionSnapshot {
  const currentUser = readCurrentUser();
  return {
    currentUser,
    isLogOn: !!(hasRefreshToken() && currentUser),
  };
}

export function writeTokens(
  accessToken: string,
  accessTokenExpiresIn: number,
  refreshToken: string
): void {
  setLocalStorage("accessToken", accessToken, accessTokenExpiresIn);
  setLocalStorage("refresh_token", refreshToken, CURRENT_USER_TTL_SECONDS);
}

/** 登录失败和 refresh 失效只删除原有的三个 Session 项。 */
export function clearSessionCredentials(): void {
  removeLocalStorage("userInfo");
  removeLocalStorage("accessToken");
  removeLocalStorage("refresh_token");
}

/** Header 主动退出及跨标签退出沿用原有的完整清理合同。 */
export function clearInteractiveSession(): void {
  removeLocalStorage("accessToken");
  removeLocalStorage("refresh_token");
  removeLocalStorage("userInfo");
  removeLocalStorage("usePWA");
  removeLocalStorage("showCardUser");
  removeStorage("all");
}
