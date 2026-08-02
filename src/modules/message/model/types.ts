/**
 * 一条站短消息
 */
export interface MessageSendReceiveProps {
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
  time: string;
  /**
   * 是否显示发送时间
   */
  showTime: boolean;
}

export interface MessageInfo {
  id: number;
  /**
   * 发送方 ID
   */
  senderId: number;
  /**
   * 接收方 ID
   */
  receiverId: number;
  /**
   * 发信时间
   */
  time: string;
  /**
   * 是否已读
   */
  isRead: boolean;
  /**
   * 发信内容
   */
  content: string;

  senderDeleted: boolean;

  receiverDeleted: boolean;

  isBookMessage: boolean;
}

export interface RecentContactUserInfo {
  /**
   * 用户 ID
   */
  userId: number;
  /**
   * 发信时间
   */
  time: string;
  /**
   * 是否已读
   */
  isRead: boolean;
  /**
   * 最后一条消息
   */
  lastContent: string;

  senderId: number;
}

/**
 * 私信 service 在 wire 消息上追加时间显示状态后的渲染模型。
 */
export interface MessageViewModel extends MessageInfo {
  showTime: boolean;
}
