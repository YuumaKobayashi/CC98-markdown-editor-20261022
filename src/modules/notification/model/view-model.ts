import type {
  ReplyAtNotificationInfo,
  SystemNotificationInfo,
} from "./dto";

export interface ReplyAtNotificationViewModel
  extends ReplyAtNotificationInfo {
  //帖子标题
  topicTitle?: string;
  //回复楼层
  floor: number;
  //回复者id
  userId: number;
  //回复者姓名
  userName: string;
  //版面名称
  boardName?: string;
}

export interface SystemNotificationViewModel
  extends SystemNotificationInfo {
  //回复楼层
  floor: number;
}
