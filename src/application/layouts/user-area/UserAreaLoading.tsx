import * as React from "react";

import styles from "./UserAreaLoading.module.scss";

interface UserAreaLoadingProps {
  children?: React.ReactNode;
}

/** 用户区域共用的加载提示。 */
export function UserAreaLoading({ children }: UserAreaLoadingProps) {
  return (
    <div className={styles["user-center-loading"]}>
      {children}
      <p className="fa fa-spinner fa-pulse fa-2x fa-fw" />
    </div>
  );
}
