import type { Dispatch } from "redux";

import { cc98Fetch } from "@foundation/api/http";
import { setLocalStorage } from "@foundation/storage/web-storage";
import { formAuthorizeHeader } from "@modules/session";
import { replaceUnreadCount } from "./unread-count-slice";
import type { UnreadCount } from "./types";

export const refreshUnreadCount = () => async (dispatch: Dispatch) => {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch("/me/unread-count", { headers });
    const unreadCount = await response.json() as UnreadCount;
    setLocalStorage("messageCount", unreadCount);
    return dispatch(replaceUnreadCount(unreadCount));
  } catch (error) {
    console.error((error as Error).message);
  }
};
