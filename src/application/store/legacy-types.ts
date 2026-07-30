import type { ErrorStore } from "@legacy/Reducers/Error";
import type { MessageInfo } from "@legacy/Reducers/Message";
import type { UserInfoStore } from "@legacy/Reducers/UserInfo";
import type { SessionState } from "@modules/session";

type LegacyActionCreators =
  & typeof import("@legacy/Actions/UserCenter")
  & typeof import("@legacy/Actions/Error")
  & typeof import("@legacy/Actions/Message");

type LegacyThunkActionCreators = typeof import("@legacy/AsyncActions");

/** S1.1 adds Session while the remaining legacy branches await later S1 batches. */
export interface RootState {
  error: ErrorStore;
  userInfo: UserInfoStore;
  message: MessageInfo;
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
