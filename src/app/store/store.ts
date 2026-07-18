import { configureStore } from "@reduxjs/toolkit";
import createHistory from "history/createBrowserHistory";
import { routerMiddleware, routerReducer as router } from "react-router-redux";
import { combineReducers } from "redux";

import * as ErrorActions from "@legacy/Actions/Error";
import * as MessageActions from "@legacy/Actions/Message";
import * as UserActions from "@legacy/Actions/UserCenter";
import error from "@legacy/Reducers/Error";
import message from "@legacy/Reducers/Message";
import userInfo from "@legacy/Reducers/UserInfo";

import type { RootState } from "./legacy-types";
import { listenerMiddleware } from "./listener-middleware";

export const Actions = {
  ...UserActions,
  ...ErrorActions,
  ...MessageActions,
};

const rootReducer = combineReducers<RootState>({
  error,
  router,
  userInfo,
  message,
});

/** Keep one browser-history instance for Router and legacy navigation effects. */
export const history = createHistory();

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
      .prepend(listenerMiddleware.middleware)
      .concat(routerMiddleware(history)),
  devTools: true,
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export default store;
