type UserBooleanSetting = "是" | "否";

export interface UnreadCount {
  systemCount: number;
  atCount: number;
  replyCount: number;
  messageCount: number;
}

/**
 * 用户消息设置选项。
 */
export class NoticeSetting {
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

export class MessageResponseProps {
  //通知Id
  id: number;
  //Type通知类型（0 = 全站系统通知，1 = 个人系统通知）
  type: number;
  //（int?类型， 有值表示这个通知超链接到具体的某个帖，null表示不连接），
  topicId: number;
  //帖子标题
  topicTitle: string;
  //回复楼层
  floor: number;
  //回复者id
  userId: number;
  //回复者姓名
  userName: string;
  //版面id
  boardId: number;
  //版面名称
  boardName: string;
  //时间
  time: Date;
  //是否已读
  isRead: boolean;
}

export class MessageSystemProps {
  //通知Id
  id: number;
  //Type通知类型（0 = 全站系统通知，1 = 个人系统通知）
  type: number;
  //标题
  title: string;
  //内容
  content: string;
  //（int?类型， 有值表示这个通知超链接到具体的某个帖，null表示不连接），
  topicId: number;
  //回复楼层
  floor: number;
  //时间
  time: Date;
  //是否已读
  isRead: boolean;
}
