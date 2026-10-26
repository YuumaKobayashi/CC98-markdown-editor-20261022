import type { SessionState } from "./types";

export interface SessionRootState {
  session: SessionState;
}

export const selectSession = (state: SessionRootState): SessionState =>
  state.session;

export const selectIsLogOn = (state: SessionRootState): boolean =>
  selectSession(state).isLogOn;

export const selectCurrentUser = (state: SessionRootState) =>
  selectSession(state).currentUser;
