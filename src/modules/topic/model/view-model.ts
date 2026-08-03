/**
 * 表示用户最近帖子
 */
export interface UserRecentTopic {
  /**
   * 帖子版面
   */
  boardName: string;
  /**
   * 发帖时间
   */
  time: string;
  /**
   * 帖子标题
   */
  title: string;
  /**
   * 用户名
   */
  userName?: string | null;
  /**
   * 用户名
   */
  isAnonymous: boolean;
  /**
   * 帖子id
   */
  id: number;
  /**
   * 帖子版面id
   */
  boardId: number;
  /**
   * 帖子内容
   */
  content?: string;
  /**
   * 获得赞数
   */
  likeCount?: number;
  /**
   * 获得踩数
   */
  dislikeCount?: number;
}
