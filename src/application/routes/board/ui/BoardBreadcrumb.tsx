import * as React from "react";
import { Link } from "react-router";

import styles from "./BoardBreadcrumb.module.scss";

interface BoardBreadcrumbProps {
  boardId: number;
  boardInfo: {
    name: string;
  };
}

/**
 * 版面头部，包括版面图标、版面介绍、版主信息等
 */
export function BoardBreadcrumb({
  boardId,
  boardInfo,
}: BoardBreadcrumbProps) {
  return (
    <div className={styles.breadcrumb}>
      <Link className={styles.homeLink} to="/">
        首页
      </Link>
      <i className="fa fa-chevron-right" />
      <Link
        className={styles.boardListLink}
        to="/boardlist"
      >
        版面列表
      </Link>
      <i className="fa fa-chevron-right" />
      <Link
        className={styles.boardLink}
        to={`/board/${boardId}`}
      >
        {boardInfo.name}
      </Link>
    </div>
  );
}
