// P07 compatibility facade. New src code must import its owning module directly.
// 获取用户信息相关的代码均已重构
// Z3 后仅保留 AnnualReview 休眠页面所需的兼容导出；Z4 随页面整体删除。
export { getAnnualReview, getAnnualReviewV2 } from "@modules/annual-review";
export { getMyInfo } from "@modules/session";
export { syncGetBoardNameById } from "@modules/board";
