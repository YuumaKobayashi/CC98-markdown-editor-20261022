/**
 * 根版面（区）的状态
 * 需要版面名称，id，主管，以及子版面
 */
export type RootBoardState =
  import("@modules/board/model/dto").BoardCategoryInfo;

/**
 * 子版面的状态
 * 需要版面名称，id，主管，今日回帖数，总主题数，总回帖数
 */
export type ChildBoardState =
  import("@modules/board/model/dto").BoardSimpleInfo;
