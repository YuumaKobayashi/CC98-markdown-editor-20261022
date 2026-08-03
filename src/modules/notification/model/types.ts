export type {
  ReplyAtNotificationInfo,
  SystemNotificationInfo,
  UnreadCount,
} from "./dto";
export type {
  ReplyAtNotificationViewModel,
  SystemNotificationViewModel,
} from "./view-model";

type UserBooleanSetting = "是" | "否";

/**
 * 用户消息设置选项。
 */
export interface NoticeSetting {
  /**
   * 回复消息。
   */
  response: UserBooleanSetting;
  /**
   * AT 消息。
   */
  attme: UserBooleanSetting;
  /**
   * 系统消息。
   */
  system: UserBooleanSetting;
  /**
   * 用户消息。
   */
  message: UserBooleanSetting;
  /**
   * 跳转到最新回复。
   */
  post: UserBooleanSetting;
}
