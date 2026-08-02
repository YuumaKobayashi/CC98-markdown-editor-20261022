import type { Dispatch } from "redux";
import { UserState } from "@modules/user";

import { Constants } from "@foundation/config/runtime-config";
import { removeStorage } from "@foundation/storage/web-storage";
import {
  clearSessionCredentials,
  writeTokens,
} from "../persistence/session-persistence";
import {
  sessionAuthenticated,
  sessionInvalidated,
} from "../model/session-slice";
import type { CurrentUser } from "../model/types";
import { getMyInfo } from "./session";
import { refreshUserInfo } from "./refresh-user-info";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

type SessionThunk<T> = (dispatch: Dispatch) => Promise<T>;

/**
 * 执行现有 password grant 登录流程。提示、主题切换、100ms 返回和最终
 * 页面跳转仍由 LoginPage 持有。
 */
export function logIn({
  userName,
  password,
}: LoginCredentials): SessionThunk<CurrentUser> {
  return async (dispatch: Dispatch): Promise<CurrentUser> => {
    dispatch(sessionInvalidated());

    try {
      const requestBody = new URLSearchParams({
        client_id: "9a1fd200-8687-44b1-4c20-08d50a96e5cd",
        client_secret: "REDACTED_CLIENT_SECRET",
        grant_type: "password",
        username: userName,
        password,
        scope: "cc98-api openid offline_access",
      });
      const response = await fetch(
        `${Constants.config.openIdUrl}/connect/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: requestBody,
        }
      );

      if (response.status !== 200) {
        throw new Error(response.status.toString());
      }

      const data = (await response.json()) as TokenResponse;
      removeStorage("mainAds-v2");
      writeTokens(
        `${data.token_type} ${data.access_token}`,
        data.expires_in,
        data.refresh_token
      );
      await refreshUserInfo();

      // getMyInfo 保留 web-storage 中既有的锁定用户清理及跳转副作用。
      const currentUser = getMyInfo();
      if (
        currentUser.lockState === UserState.Locked ||
        currentUser.lockState === UserState.Shielded
      ) {
        throw new Error("账号已锁定");
      }

      dispatch(sessionAuthenticated());
      return currentUser;
    } catch (error) {
      clearSessionCredentials();
      dispatch(sessionInvalidated());
      throw error;
    }
  };
}
