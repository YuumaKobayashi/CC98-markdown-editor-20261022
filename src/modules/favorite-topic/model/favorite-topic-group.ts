export type FavoriteTopicGroup = {
  count: number;
  createTime: string;
  id: number;
  name: string;
};

export enum FavoriteTopicOrder {
  PostTime = 0,
  LastReply = 1,
  FavorTime = 2,
}

export const defaultFavoriteTopicGroups: FavoriteTopicGroup[] = [
  {
    id: 0,
    name: "默认分组",
    count: 10,
    createTime: "1998-09-08T09:08:00+08:00",
  },
];
