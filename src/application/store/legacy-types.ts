import type { UserInfoStore } from "@legacy/Reducers/UserInfo";
import type { UnreadCount } from "@modules/notification";
import type { SessionState } from "@modules/session";

type LegacyActionCreators = typeof import("@legacy/Actions/UserCenter");

type LegacyThunkActionCreators = typeof import("@legacy/AsyncActions");

/** S1.5 leaves only the refreshCurrentUserInfo error bridge in legacy userInfo. */
export interface RootState {
  userInfo: UserInfoStore;
  notification: UnreadCount;
  session: SessionState;
}

/** Compatibility union for existing reducer and thunk annotations. */
export type RootAction = ReturnType<
  LegacyActionCreators[keyof LegacyActionCreators]
>;

/** Compatibility union retained for legacy connected components. */
export type RootThunkAction = ReturnType<
  LegacyThunkActionCreators[keyof LegacyThunkActionCreators]
>;
