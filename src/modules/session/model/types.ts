import type { UserInfo } from "@modules/user/model/dto";

/**
 * 当前登录用户的 `/me` 合同。
 *
 * 主后端 `/me` 返回完整的 `UserInfo`。Session 只拥有登录状态、
 * 持久化和跨标签同步，不重复声明 User wire 字段。
 */
/**
 * 当前用户的信息。
 */
export type CurrentUser = UserInfo;

export interface SessionState {
  /**
   * 登录状态必须独立保存。旧流程在登录请求开始时会先变为未登录，
   * 但仍保留上一次的当前用户对象。
   */
  isLogOn: boolean;
  currentUser: CurrentUser;
}
