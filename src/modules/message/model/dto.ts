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
