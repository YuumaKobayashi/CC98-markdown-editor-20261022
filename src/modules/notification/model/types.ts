import type { NotificationType } from "./enums";
import type { PostBasicInfo } from "@modules/post";

export type { UnreadCount } from "./dto";

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

export interface ReplyAtNotificationInfo {
  //通知Id
  id: number;
  //Type通知类型（0 = 全站系统通知，1 = 个人系统通知）
  type: NotificationType;
  //（int?类型， 有值表示这个通知超链接到具体的某个帖，null表示不连接），
  topicId: number;
  //发言id
  postId: number | null;
  //版面id
  boardId: number;
  //时间
  time: string;
  //是否已读
  isRead: boolean;
  //对应发言的基本信息，发言不存在时为 null
  postBasicInfo: PostBasicInfo | null;
}

export interface SystemNotificationInfo {
  //通知Id
  id: number;
  //Type通知类型（0 = 全站系统通知，1 = 个人系统通知）
  type: NotificationType;
  //标题
  title: string | null;
  //内容
  content: string | null;
  //（int?类型， 有值表示这个通知超链接到具体的某个帖，null表示不连接），
  topicId: number | null;
  //发言id
  postId: number | null;
  //时间
  time: string;
  //是否已读
  isRead: boolean;
  //对应发言的基本信息，发言不存在时为 null
  postBasicInfo: PostBasicInfo | null;
}

export interface ReplyAtNotificationViewModel extends ReplyAtNotificationInfo {
  //帖子标题
  topicTitle: string;
  //回复楼层
  floor: number;
  //回复者id
  userId: number;
  //回复者姓名
  userName: string;
  //版面名称
  boardName: string;
}

export interface SystemNotificationViewModel extends SystemNotificationInfo {
  //回复楼层
  floor: number;
}

/** 旧组件 props 名；组件只接收 ViewModel 中实际渲染的字段。 */
export type MessageResponseProps = Omit<
  ReplyAtNotificationViewModel,
  "postId" | "postBasicInfo"
>;

/** 旧组件 props 名；组件只接收 ViewModel 中实际渲染的字段。 */
export type MessageSystemProps = Omit<
  SystemNotificationViewModel,
  "postId" | "postBasicInfo"
>;
