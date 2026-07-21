import * as React from "react";
import { Outlet } from "react-router";

import { useAppSelector } from "@app/store";
import { LogOut } from "@legacy/Components/Status";
import DocumentTitle from "@shared/ui/document-title";
import { UserCenterNavigation } from "./UserCenterNavigation";

/**
 * 用户中心页面
 */
export function UserCenterLayout() {
  const isLogOn = useAppSelector((state) => state.userInfo.isLogOn);

  if (!isLogOn) {
    return <LogOut />;
  }

  return (
    <div className="user-center">
      <DocumentTitle title="个人中心 - CC98论坛" />
      <div className="user-center-content">
        <div className="user-center-head">
          <p>个人中心</p>
        </div>
        <div className="user-center-body">
        <UserCenterNavigation />
          <div className="user-center-router">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
