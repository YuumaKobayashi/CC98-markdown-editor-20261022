import * as React from "react";
import { Link } from "react-router";

import styles from "./RecommendedTopicsBreadcrumb.module.scss";
import frameStyles from "./TopicBreadcrumbFrame.module.scss";

/**
 * 导航器组件
 */
export function RecommendedTopicsBreadcrumb() {
  return (
    <div className={frameStyles.breadcrumb}>
      <Link className={frameStyles.homeLink} to="/">
        首页
      </Link>
      <i className="fa fa-chevron-right" />
      <div className={styles.currentPage}>随机精选</div>
    </div>
  );
}
