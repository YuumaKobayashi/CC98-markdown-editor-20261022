// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

//版面事件数据
export interface BoardEvent {
  id: number;
  topicId: number;
  boardId: number;
  targetUserName: string;
  operatorUserName: string;
  content: string;
  time: Date;
  ip: string;
  isDeleted: boolean;
}
