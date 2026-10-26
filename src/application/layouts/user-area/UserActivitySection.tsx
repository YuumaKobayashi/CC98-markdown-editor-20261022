import * as React from "react";

import styles from "./UserActivitySection.module.scss";

interface UserActivitySectionProps {
  title: string;
  children: React.ReactNode;
}

/** 用户资料页中的活动分区。 */
export function UserActivitySection({
  title,
  children,
}: UserActivitySectionProps) {
  return (
    <div className={styles["user-activities"]}>
      <p>{title}</p>
      {children}
    </div>
  );
}
