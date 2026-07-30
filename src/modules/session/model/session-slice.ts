import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { readSessionSnapshot } from "../persistence/session-persistence";
import type { CurrentUser, SessionState } from "./types";

const persistedSession = readSessionSnapshot();

const initialState: SessionState = {
  isLogOn: persistedSession.isLogOn,
  // 旧 userInfo reducer 在未登录时也提供一个空对象，消费者依赖该合同。
  currentUser: persistedSession.currentUser || ({} as CurrentUser),
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    currentUserReceived(
      state,
      action: PayloadAction<CurrentUser>
    ): void {
      state.currentUser = action.payload;
    },
    sessionAuthenticated(state): void {
      state.isLogOn = true;
    },
    sessionInvalidated(state): void {
      // 保留旧 USER_LOG_OFF 行为：只改变登录状态，不清空内存中的用户对象。
      state.isLogOn = false;
    },
  },
});

export const {
  currentUserReceived,
  sessionAuthenticated,
  sessionInvalidated,
} = sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;
