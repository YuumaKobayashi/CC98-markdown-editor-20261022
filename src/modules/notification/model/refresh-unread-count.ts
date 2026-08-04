import type { Dispatch } from "redux";

import { setLocalStorage } from "@foundation/storage/web-storage";
import { getUnreadCount } from "../api/service";
import { replaceUnreadCount } from "./unread-count-slice";

export const refreshUnreadCount = () => async (dispatch: Dispatch) => {
  try {
    const unreadCount = await getUnreadCount();
    setLocalStorage("messageCount", unreadCount);
    return dispatch(replaceUnreadCount(unreadCount));
  } catch (error) {
    console.error((error as Error).message);
  }
};
