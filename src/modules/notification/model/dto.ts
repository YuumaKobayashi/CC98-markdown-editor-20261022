import type { PostBasicInfo } from "@modules/post";
import type { NotificationType } from "./enums";

export interface UnreadCount {
  systemCount: number;
  atCount: number;
  replyCount: number;
  messageCount: number;
}

export interface ReplyAtNotificationInfo {
  //通知Id
  id: number;
  //Type通知类型（0 = 全站系统通知，1 = 个人系统通知）
  type: NotificationType;
  //（int?类型， 有值表示这个通知超链接到具体的某个帖，null表示不连接），
  topicId: number | null;
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
