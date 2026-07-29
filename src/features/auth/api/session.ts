import { Constants } from "@foundation/config/runtime-config";
import {
  getAccessToken,
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";
import { getMyInfo } from "@entities/user/storage/current-user";
import { logOffAndNavigate } from "@foundation/lib/legacy-utility-effects";

/**
 * 获取当前的用户登录令牌。
 * @returns {string} 用户当前有效的登录令牌。
 */
export async function getToken(): Promise<string> {
  const refreshToken = getLocalStorage<string>("refresh_token");
  if (!refreshToken) return null;

  let token = getAccessToken();
  if (token) return token;

  const requestBody = {
    client_id: "9a1fd200-8687-44b1-4c20-08d50a96e5cd",
    client_secret: "REDACTED_CLIENT_SECRET",
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  const response = await fetch(Constants.config.openIdUrl + "/connect/token", {
    method: "POST",
    headers,
    body: Object.keys(requestBody)
      .map((key) => `${key}=${requestBody[key]}`)
      .join("&"),
  });
  const data = await response.json();

  if (data.access_token) {
    token = "Bearer " + encodeURIComponent(data.access_token);
    setLocalStorage("accessToken", token, data.expires_in);
    return token;
  }

  removeLocalStorage("userInfo");
  removeLocalStorage("accessToken");
  removeLocalStorage("refresh_token");
  logOffAndNavigate();
}

export async function formAuthorizeHeader(): Promise<Headers> {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  return headers;
}

/*
 * 返回用户是否登陆
 */
export function isLogOn(): boolean {
  const token = getLocalStorage("refresh_token");
  const userInfo = getMyInfo();
  return !!(token && userInfo);
}
