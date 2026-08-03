/**
 * 表示用户最近帖子
 */
export interface UserRecentPost {
  /**
   * 帖子版面
   */
  boardName: string;
  /**
   * 发帖时间
   */
  time: string;
  /**
   * 楼层
   */
  floor: number;
  /**
   * 帖子标题
   */
  title: string | null;
  /**
   * 用户名
   */
  userName: string | null;
  /**
   * 用户名
   */
  isAnonymous: boolean;
  /**
   * 回复id
   */
  id: number;
  /**
   * 帖子id
   */
  topicId: number;
  /**
   * 帖子版面id
   */
  boardId: number;
  /**
   * 帖子内容
   */
  content: string;
  /**
   * 获得赞数
   */
  likeCount: number;
  /**
   * 获得踩数
   */
  dislikeCount: number;
}
