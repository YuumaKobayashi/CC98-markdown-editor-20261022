// P07 compatibility facade. New src code must import its owning module directly.
export * from "@foundation/storage/web-storage";
export * from "@entities/user/storage/current-user";
export * from "@features/auth/api/session";
export * from "@foundation/api/http";
export * from "@entities/user/api/service";
export * from "@entities/board/api/service";
export * from "@entities/topic/api/service";
export * from "@entities/message/api/service";
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
export { getUserInfo, getUserInfo as getUserInfoByName } from "@entities/user/api/get-user-info";
export { getUsersInfo, getUsersInfo as getUsersInfobyNames } from "@entities/user/api/get-users-info";
