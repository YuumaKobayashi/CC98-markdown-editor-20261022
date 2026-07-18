import { MyInfo } from "@legacy/States/AppState";
import { getLocalStorage } from "@shared/storage/web-storage";

/**
 * 获取当前的用户信息。
 * @returns {MyInfo} 当前的用户信息。
 */
export function getMyInfo(): MyInfo {
  return getLocalStorage<MyInfo>("userInfo");
}
