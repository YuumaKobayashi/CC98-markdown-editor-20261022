import * as React from "react";

import { DocumentTitle } from "@foundation/ui/document-title";

import styles from "./UserAreaShell.module.scss";

interface UserAreaShellProps {
  heading: string;
  documentTitle?: string;
  children: React.ReactNode;
}

/** 用户中心与用户详情共同的页面骨架。 */
export function UserAreaShell({
  heading,
  documentTitle,
  children,
}: UserAreaShellProps) {
  return (
    <div className={styles["user-center"]}>
      {documentTitle ? <DocumentTitle title={documentTitle} /> : null}
      <div className={styles["user-center-content"]}>
        <div className={styles["user-center-head"]}>
          <p>{heading}</p>
        </div>
        <div className={styles["user-center-body"]}>{children}</div>
      </div>
    </div>
  );
}
