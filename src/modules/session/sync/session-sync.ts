import type { Dispatch } from "redux";

import { changeTheme } from "@foundation/theme";
import { logOut, restoreSession } from "../model/session-actions";
import type { CurrentUser } from "../model/types";

const parseStoredCurrentUser = (value: string): CurrentUser =>
  JSON.parse(value.slice(4)) as CurrentUser;

/** storage 事件只会发送给其他标签页；此处只处理 Session 的 userInfo。 */
export function synchronizeSessionStorageEvent(event: StorageEvent) {
  return (dispatch: Dispatch): void => {
    if (event.key !== "userInfo") return;

    if (event.oldValue && event.newValue) {
      const oldValue = parseStoredCurrentUser(event.oldValue);
      const newValue = parseStoredCurrentUser(event.newValue);
      const comparableOldValue = {
        ...oldValue,
        lastLogOnTime: undefined,
      };
      const comparableNewValue = {
        ...newValue,
        lastLogOnTime: undefined,
      };
      if (
        JSON.stringify(comparableOldValue) ===
        JSON.stringify(comparableNewValue)
      ) {
        return;
      }
    }

    if (event.newValue) {
      const currentUser = parseStoredCurrentUser(event.newValue);
      changeTheme(currentUser.theme);
      dispatch(restoreSession(currentUser) as any);
      return;
    }

    dispatch(logOut() as any);
    window.location.href = "/";
  };
}
