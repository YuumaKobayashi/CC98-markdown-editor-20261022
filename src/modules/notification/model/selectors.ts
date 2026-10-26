import type { UnreadCount } from "./types";

export interface NotificationRootState {
  notification: UnreadCount;
}

export const selectUnreadCount = (
  state: NotificationRootState
): UnreadCount => state.notification;
