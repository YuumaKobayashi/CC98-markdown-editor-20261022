import * as React from "react";
import { Link } from "react-router";

import styles from "./HotTopicBreadcrumb.module.scss";

interface HotTopicBreadcrumbProps {
  label: string;
}

/**
 * 导航器组件
 */
export function HotTopicBreadcrumb({ label }: HotTopicBreadcrumbProps) {
  return (
    <div className={styles.breadcrumb}>
      <Link className={styles.homeLink} to="/">
        首页
      </Link>
      <i className="fa fa-chevron-right"></i>
      <div className={styles.currentPage}>{label}</div>
    </div>
  );
}
