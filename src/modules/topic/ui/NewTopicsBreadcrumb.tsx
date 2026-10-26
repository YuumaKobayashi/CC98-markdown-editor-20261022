import * as React from "react";
import { Link } from "react-router";

import styles from "./NewTopicsBreadcrumb.module.scss";

/**
 * 导航器组件
 */
export function NewTopicsBreadcrumb() {
  return (
    <div className={styles.breadcrumb}>
      <Link className={styles.homeLink} to="/">
        首页
      </Link>
      <i className="fa fa-chevron-right" />
      <div className={styles.currentPage}>查看新帖</div>
    </div>
  );
}
