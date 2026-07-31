import * as React from "react";

import { useUserProfileContext } from "@application/routes/user-profile/layout";

import { DeleteRecentUserContent } from "./DeleteRecentUserContent";
import { UserPunishmentForm } from "./UserPunishmentForm";
import { UserRecentPostsManager } from "./UserRecentPostsManager";

//TODO: 调整组件逻辑
export function UserProfileManagePage() {
  const { userInfo } = useUserProfileContext();
  return (
    <div className="user-manage" key={userInfo.id}>
      <div className="user-manage-infos">
        <h2>用户信息</h2>
        <div className="user-manage-info">
          <p>id:{userInfo.id}</p>
          <p>name: {userInfo.name}</p>
        </div>
      </div>
      <UserPunishmentForm id={userInfo.id} />
      <DeleteRecentUserContent id={userInfo.id} />
      <UserRecentPostsManager id={userInfo.id} />
    </div>
  );
}
