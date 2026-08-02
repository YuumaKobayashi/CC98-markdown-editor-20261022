/**
 * 根版面（区）的状态
 * 需要版面名称，id，主管，以及子版面
 */
export interface RootBoardState {
  name: string;
  id: number;
  masters: string[];
  boards: ChildBoardState[];
}

/**
 * 子版面的状态
 * 需要版面名称，id，主管，今日回帖数，总主题数，总回帖数
 */
export interface ChildBoardState {
  name: string;
  id: number;
  masters: string[];
  todayCount: number;
  topicCount: number;
  postCount: number;
}
