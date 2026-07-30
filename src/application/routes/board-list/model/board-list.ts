/**
 * 根版面（区）的状态
 * 需要版面名称，id，主管，以及子版面
 */
export class RootBoardState {
  name: string;
  id: number;
  masters: string[];
  boards: ChildBoardState[];

  constructor(
    name: string,
    id: number,
    masters: string[],
    boards: ChildBoardState[]
  ) {
    this.name = name;
    this.id = id;
    this.masters = masters;
    this.boards = boards;
  }
}

/**
 * 子版面的状态
 * 需要版面名称，id，主管，今日回帖数，总主题数，总回帖数
 */
export class ChildBoardState {
  name: string;
  id: number;
  masters: string[];
  todayCount: number;
  topicCount: number;
  postCount: number;

  constructor(
    name: string,
    id: number,
    masters: string[],
    todayCount: number,
    topicCount: number,
    postCount: number
  ) {
    this.name = name;
    this.id = id;
    this.masters = masters;
    this.todayCount = todayCount;
    this.topicCount = topicCount;
    this.postCount = postCount;
  }
}
