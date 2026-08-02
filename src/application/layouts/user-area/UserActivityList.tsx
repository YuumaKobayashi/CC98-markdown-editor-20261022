import * as React from "react";

import styles from "./UserActivityList.module.scss";

interface UserActivityListProps {
  children: React.ReactNode;
}

/** 用户活动条目的默认列表容器。 */
export function UserActivityList({ children }: UserActivityListProps) {
  return <div className={styles["user-posts"]}>{children}</div>;
}
