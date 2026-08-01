import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import {
  refreshCurrentUserInfo,
  selectCurrentUser,
} from "@modules/session";
import { UserProfile } from "@modules/user";
import { UserProfileAvatar } from "@modules/user";

import { UserRecentActivities } from "./UserRecentActivities";
import styles from "../../UserCenter.module.scss";

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
