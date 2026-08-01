import * as React from "react";

import { useUserProfileContext } from "@application/routes/user-profile/layout";
import { UserProfileAvatar } from "@modules/user";
import DocumentTitle from "@foundation/ui/document-title";
import { UserProfileDetails } from "./UserProfileDetails";
import { UserRecentTopics } from "./UserRecentTopics";
import styles from "../../../user-center/UserCenter.module.scss";

export function UserProfileOverview() {
  const { userInfo } = useUserProfileContext();
  return (
    <div className={styles["user-center-exact"]} key={userInfo.id}>
      <DocumentTitle title={`${userInfo.name} - 用户详情 - CC98论坛`} />
      <UserProfileAvatar userInfo={userInfo} />
      <UserProfileDetails userInfo={userInfo} />
      <UserRecentTopics id={userInfo.id} />
    </div>
  );
}
