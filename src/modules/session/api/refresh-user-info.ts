import { setLocalStorage, getLocalStorage } from "@foundation/storage/web-storage";
import { formAuthorizeHeader } from "./session";
import { cc98Fetch } from "@foundation/api/http";
import { changeLegacyCurrentUser } from "@foundation/lib/legacy-utility-effects";

/**
 * 刷新当前用户信息
 */
export async function refreshUserInfo() {
  if (getLocalStorage("refresh_token")) {
    let headers = await formAuthorizeHeader();
    let response = await cc98Fetch(`/me`, {
      headers,
    });

    let userInfo = await response.json();
    changeLegacyCurrentUser(userInfo);
    setLocalStorage("userInfo", userInfo, 2592000);
  }
}
