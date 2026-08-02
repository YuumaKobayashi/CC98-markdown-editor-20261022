import * as React from "react";

import type { UserInfo } from "@modules/user";

export type UserProfilePage = "exact" | "manage";

export interface UserProfileContextValue {
  page: UserProfilePage;
  userInfo: UserInfo;
}

const UserProfileContext = React.createContext<UserProfileContextValue | null>(
  null
);

export const UserProfileProvider = UserProfileContext.Provider;

export function useUserProfileContext(): UserProfileContextValue {
  const context = React.useContext(UserProfileContext);
  if (!context) {
    throw new Error(
      "useUserProfileContext must be used within UserProfileLayout"
    );
  }
  return context;
}
