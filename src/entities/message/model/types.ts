/**
 * 一条站短消息
 */
export class MessageSendReceiveProps {
  /**
   * 消息的标识
   */
  id: number;
  /**
   * 消息的发送者的名字
   */
  senderName: string;
  /**
   * 消息的发送者的id
   */
  senderId: number;
  /**
   * 消息的接收者的名字
   */
  receiverName: string;
  /**
   * 消息的接收者的id
   */
  receiverId: number;
  /**
   * 消息的发送者的头像地址
   */
  senderPortraitUrl: string;
  /**
   * 消息的接收者的头像地址
   */
  receiverPortraitUrl: string;
  /**
   * 消息的正文
   */
  content: string;
  /**
   * 消息是否已经被阅读。true 表示消息已经阅读，false 表示消息尚未阅读
   */
  isRead: boolean;
  /**
   * 消息的发送时间
   */
  time: Date;
  /**
   * 是否显示发送时间
   */
  showTime: boolean;
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
