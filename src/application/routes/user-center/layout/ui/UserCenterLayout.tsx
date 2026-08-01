import * as React from "react";
import { Outlet } from "react-router";

import { useAppSelector } from "@application/store";
import { selectIsLogOn } from "@modules/session";
import { LogOut } from "@application/routes/status";
import DocumentTitle from "@foundation/ui/document-title";
import { UserCenterNavigation } from "./UserCenterNavigation";
import styles from "../../../../layouts/user-area/UserArea.module.scss";

/**
 * 用户中心页面
 */
export function UserCenterLayout() {
  const isLogOn = useAppSelector(selectIsLogOn);

  if (!isLogOn) {
    return <LogOut />;
  }

  return (
    <div className={styles["user-center"]}>
      <DocumentTitle title="个人中心 - CC98论坛" />
      <div className={styles["user-center-content"]}>
        <div className={styles["user-center-head"]}>
          <p>个人中心</p>
        </div>
        <div className={styles["user-center-body"]}>
        <UserCenterNavigation />
          <div className={styles["user-center-router"]}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
