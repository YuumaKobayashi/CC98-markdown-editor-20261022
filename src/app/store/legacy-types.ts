import type { RouterState } from "react-router-redux";

import type { ErrorStore } from "@legacy/Reducers/Error";
import type { MessageInfo } from "@legacy/Reducers/Message";
import type { UserInfoStore } from "@legacy/Reducers/UserInfo";

type LegacyActionCreators =
  & typeof import("@legacy/Actions/UserCenter")
  & typeof import("@legacy/Actions/Error")
  & typeof import("@legacy/Actions/Message");

type LegacyThunkActionCreators = typeof import("@legacy/AsyncActions");

/** The four reducer branches that are live before the domain migrations. */
export interface RootState {
  error: ErrorStore;
  userInfo: UserInfoStore;
  message: MessageInfo;
  router: RouterState;
}

/** Compatibility union for existing reducer and thunk annotations. */
export type RootAction = ReturnType<
  LegacyActionCreators[keyof LegacyActionCreators]
>;

/** Compatibility union retained for legacy connected components. */
export type RootThunkAction = ReturnType<
  LegacyThunkActionCreators[keyof LegacyThunkActionCreators]
>;
