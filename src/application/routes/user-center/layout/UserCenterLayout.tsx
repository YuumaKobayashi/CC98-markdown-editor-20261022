import * as React from "react";
import { Outlet } from "react-router";

import { UserAreaShell } from "@application/layouts/user-area";
import { useAppSelector } from "@application/store";
import { selectIsLogOn } from "@modules/session/model/selectors";
import { LogOut } from "@application/routes/status";
import { UserCenterNavigation } from "./UserCenterNavigation";
import styles from "./UserCenterLayout.module.scss";

/**
 * 用户中心页面
 */
export function UserCenterLayout() {
  const isLogOn = useAppSelector(selectIsLogOn);

  if (!isLogOn) {
    return <LogOut />;
  }

  return (
    <UserAreaShell
      heading="个人中心"
      documentTitle="个人中心 - CC98论坛"
    >
      <UserCenterNavigation />
      <div className={styles["user-center-router"]}>
        <Outlet />
      </div>
    </UserAreaShell>
  );
}
