export type FavoriteTopicGroup = {
  count: number;
  createTime: string;
  id: number;
  name: string;
};

export const defaultFavoriteTopicGroups: FavoriteTopicGroup[] = [
  {
    id: 0,
    name: "默认分组",
    count: 10,
    createTime: "1998-09-08T09:08:00+08:00",
  },
];
