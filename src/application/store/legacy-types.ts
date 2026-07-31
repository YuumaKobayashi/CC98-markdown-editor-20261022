import type { ErrorStore } from "@legacy/Reducers/Error";
import type { UserInfoStore } from "@legacy/Reducers/UserInfo";
import type { UnreadCount } from "@modules/notification";
import type { SessionState } from "@modules/session";

type LegacyActionCreators =
  & typeof import("@legacy/Actions/UserCenter")
  & typeof import("@legacy/Actions/Error");

type LegacyThunkActionCreators = typeof import("@legacy/AsyncActions");

/** S1.1 adds Session and S1.3 adds Notification while legacy branches await later batches. */
export interface RootState {
  error: ErrorStore;
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
