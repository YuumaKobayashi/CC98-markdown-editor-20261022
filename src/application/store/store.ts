import { configureStore } from "@reduxjs/toolkit";

import { registerLegacyUtilityEffects } from "@application/compatibility/register-utility-effects";
import { notificationReducer } from "@modules/notification";
import { sessionReducer } from "@modules/session";

import { listenerMiddleware } from "./listener-middleware";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Utility 的命令式兼容端口由唯一 Store 装配点注入，不再自行导入 Store。
registerLegacyUtilityEffects(store.dispatch, store.getState);

export default store;
