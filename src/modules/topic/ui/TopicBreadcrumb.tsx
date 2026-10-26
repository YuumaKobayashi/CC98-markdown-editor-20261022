import * as React from "react";
import { Link } from "react-router";

import frameStyles from "./TopicBreadcrumbFrame.module.scss";
import styles from "./TopicBreadcrumb.module.scss";

export type TopicBreadcrumbProps = {
  topicInfo: {
    boardId: number | string;
    title: string;
  };
  boardInfo: {
    name: string;
  };
  topicId: number | string;
};

export function TopicBreadcrumb({
  topicInfo,
  boardInfo,
  topicId,
}: TopicBreadcrumbProps) {
  const listUrl = `/board/${topicInfo.boardId}`;
  const topicUrl = `/topic/${topicId}`;

  return (
    <div className={frameStyles.breadcrumb}>
      <Link className={frameStyles.homeLink} to="/">
        首页
      </Link>
      <i className="fa fa-chevron-right"></i>
      <Link className={styles.segmentLink} to="/boardlist">
        版面列表
      </Link>
      <i className="fa fa-chevron-right"></i>
      <Link className={styles.segmentLink} to={listUrl}>
        {boardInfo.name}
      </Link>
      <i className="fa fa-chevron-right"></i>
      <Link className={styles.segmentLink} to={topicUrl}>
        <div className={styles.topicTitle}>{topicInfo.title}</div>
      </Link>
    </div>
  );
}
