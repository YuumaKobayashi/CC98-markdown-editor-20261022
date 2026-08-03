import type {
  ReplyAtNotificationInfo,
  SystemNotificationInfo,
} from "./dto";
import type {
  ReplyAtNotificationViewModel,
  SystemNotificationViewModel,
} from "./view-model";

export interface ReplyAtNotificationEnrichment {
  topicTitle: string;
  boardId: number;
  boardName: string;
}

export function toSystemNotificationViewModel(
  notification: Readonly<SystemNotificationInfo>,
): SystemNotificationViewModel {
  return {
    ...notification,
    floor: notification.postId ? notification.postBasicInfo!.floor : 0,
  };
}

export function toReplyAtNotificationViewModel(
  notification: Readonly<ReplyAtNotificationInfo>,
  enrichment?: Readonly<ReplyAtNotificationEnrichment>,
): ReplyAtNotificationViewModel {
  return {
    ...notification,
    ...(enrichment ?? {}),
    floor: notification.postId ? notification.postBasicInfo!.floor : 1,
    userId: notification.postId ? notification.postBasicInfo!.userId : -1,
    userName: notification.postId
      ? notification.postBasicInfo!.userName
      : "有人",
  };
}
