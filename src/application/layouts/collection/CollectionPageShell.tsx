import * as React from "react";

import { DocumentTitle } from "@foundation/ui/document-title";

import styles from "./CollectionPageShell.module.scss";

interface CollectionPageShellProps {
  documentTitle: string;
  children: React.ReactNode;
  afterContent?: React.ReactNode;
}

/** 内容集合页面共同的居中页面骨架。 */
export function CollectionPageShell({
  documentTitle,
  children,
  afterContent,
}: CollectionPageShellProps) {
  return (
    <div className={styles["focus-root"]}>
      <DocumentTitle title={documentTitle} />
      <div className={styles.focus}>{children}</div>
      {afterContent}
    </div>
  );
}
