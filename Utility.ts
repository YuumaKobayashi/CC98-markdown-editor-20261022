// P07 compatibility facade. New src code must import its owning module directly.
export * from "@foundation/storage/web-storage";
export * from "@modules/user";
export * from "@features/auth/api/session";
export * from "@foundation/api/http";
export * from "@modules/board";
export * from "@modules/topic";
export * from "@modules/message";
export * from "@features/reactions/api/service";
export * from "@features/posting/api/service";
export * from "@features/follow/api/service";
export * from "@features/favorites/api/service";
export * from "@features/message/api/service";
export * from "@features/moderation/api/service";
export * from "@features/account/api/service";
export * from "@foundation/lib/time";
export * from "@foundation/lib/page";
export * from "@foundation/lib/dom";
export * from "@foundation/lib/text";
export * from "@foundation/lib/async";
export * from "@foundation/theme/runtime";

// 获取用户信息相关的代码均已重构
export { getUserInfo as getUserInfoByName } from "@modules/user";
export { getUsersInfo as getUsersInfobyNames } from "@modules/user";
