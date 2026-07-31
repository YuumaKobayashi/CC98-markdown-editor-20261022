import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";

import * as UserCenterActions from "@legacy/Actions/UserCenter";
import {
  currentUserReceived,
  sessionAuthenticated,
} from "@modules/session";
import { writeUserInfoCache } from "@modules/user";
import type { RootState } from "./legacy-types";
import type { AppDispatch } from "./store";

/**
 * P09 installs the application listener infrastructure without registering
 * business listeners. Domain phases add listeners only with their owner.
 */
export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

// 旧 CHANGE_USERINFO reducer 会同时刷新 User cache。Session 不反向依赖
// User Module，由 Application listener 保留这项跨模块编排。
startAppListening({
  actionCreator: currentUserReceived,
  effect: (action) => {
    void writeUserInfoCache(action.payload);
  },
});

// 旧 USER_LOG_ON 会重建 S1.7 尚待删除的 userInfo 错误兼容状态。
startAppListening({
  actionCreator: sessionAuthenticated,
  effect: (_, listenerApi) => {
    listenerApi.dispatch(UserCenterActions.resetUserInfoAfterLogin());
  },
});
