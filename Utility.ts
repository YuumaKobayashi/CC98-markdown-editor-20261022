// P07 compatibility facade. New src code must import its owning module directly.
export * from "@foundation/storage/web-storage";
export * from "@modules/user";
export * from "@modules/session";
export * from "@modules/daily-signin";
export * from "@modules/site-content";
export * from "@modules/wealth";
export * from "@modules/user-preference";
export * from "@modules/annual-review";
export * from "@foundation/api/http";
export * from "@modules/board";
export * from "@modules/topic";
export * from "@modules/message";
export * from "@modules/reaction";
export * from "@modules/post-rating";
export * from "@modules/posting";
export * from "@modules/upload";
export * from "@modules/follow";
export * from "@modules/favorite-topic";
export * from "@modules/notification";
export * from "@modules/moderation";
export * from "@foundation/lib/time";
export * from "@foundation/lib/page";
export * from "@foundation/lib/dom";
export * from "@foundation/lib/text";
export * from "@foundation/lib/async";
export * from "@foundation/theme/runtime";

// 获取用户信息相关的代码均已重构
export { getUserInfo as getUserInfoByName } from "@modules/user";
export { getUsersInfo as getUsersInfobyNames } from "@modules/user";
