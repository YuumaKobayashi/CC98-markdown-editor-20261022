import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";

import { currentUserReceived } from "@modules/session/model/session-slice";
import { writeUserInfoCache } from "@modules/user/cache/public-user-cache";
import type { AppDispatch, RootState } from "./store";

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
