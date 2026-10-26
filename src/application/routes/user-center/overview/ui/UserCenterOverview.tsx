import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import { refreshCurrentUserInfo } from "@modules/session/api/refresh-user-info";
import { selectCurrentUser } from "@modules/session/model/selectors";
import { UserProfile } from "@modules/user/ui/UserProfile";
import { UserProfileAvatar } from "@modules/user/ui/profile-avatar/UserProfileAvatar";

import { UserRecentActivities } from "./UserRecentActivities";
import styles from "./UserCenterOverview.module.scss";

/**
 * 用户中心主页
 */
export function UserCenterOverview() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectCurrentUser);

  React.useEffect(() => {
    dispatch(refreshCurrentUserInfo());
  }, [dispatch]);

  return (
    <div className={styles["user-center-exact"]}>
      <UserProfileAvatar userInfo={userInfo} />
      <UserProfile userInfo={userInfo} />
      <UserRecentActivities />
    </div>
  );
}
