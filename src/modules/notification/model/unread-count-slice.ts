import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { UnreadCount } from "./types";

const initialState: UnreadCount = {
  systemCount: 0,
  atCount: 0,
  replyCount: 0,
  messageCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    replaceUnreadCount(
      _state,
      action: PayloadAction<UnreadCount>
    ): UnreadCount {
      return action.payload;
    },
  },
});

export const { replaceUnreadCount } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
