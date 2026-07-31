import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import * as UserActions from "@legacy/Actions/UserCenter";
import userInfo from "@legacy/Reducers/UserInfo";
import { notificationReducer } from "@modules/notification";
import { sessionReducer } from "@modules/session";

import type { RootState } from "./legacy-types";
import { listenerMiddleware } from "./listener-middleware";

export const Actions = {
  ...UserActions,
};

const rootReducer = combineReducers<RootState>({
  userInfo,
  notification: notificationReducer,
  session: sessionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Legacy thunks mutate objects returned by getState(). P09 records but
      // intentionally does not repair that behavior.
      immutableCheck: false,
      // Legacy state contains class instances and router state. Domain phases
      // will establish serializable state contracts incrementally.
      serializableCheck: false,
    })
      .prepend(listenerMiddleware.middleware),
  devTools: true,
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export default store;
