import * as React from "react";

import { useAppDispatch, useAppSelector } from "@app/store";
import { UserProfile } from "@entities/user";
import { UserProfileAvatar } from "@entities/user/profile-avatar";
import * as Actions from "@legacy/Actions/UserCenter";
import { refreshCurrentUserInfo } from "@legacy/AsyncActions/UserCenter";

import { UserRecentActivities } from "./UserRecentActivities";

/**
 * 用户中心主页
 */
export function UserCenterOverview() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.userInfo.currentUserInfo);

  //组件加载时更新store与缓存中的状态
  React.useEffect(() => {
    dispatch(Actions.changeUserCenterPage("profile"));
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(refreshCurrentUserInfo());
  }, [dispatch]);

  return (
    <div className="user-center-exact">
      <UserProfileAvatar userInfo={userInfo} />
      <UserProfile userInfo={userInfo} />
      <UserRecentActivities />
    </div>
  );
}
