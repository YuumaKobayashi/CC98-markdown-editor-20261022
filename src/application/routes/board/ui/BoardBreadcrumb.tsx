import * as React from "react";
import { Link } from "react-router";

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
    <div
      className="cc98-row"
      style={{
        alignItems: "baseline",
        width: "100% ",
        justifyContent: "flex-start",
        color: "grey",
        fontSize: "0.75rem",
        marginBottom: "1rem",
      }}
    >
      <Link
        style={{ color: "grey", fontSize: "1rem", marginRight: "0.5rem" }}
        to="/"
      >
        首页
      </Link>
      <i className="fa fa-chevron-right" />
      <Link
        style={{
          color: "grey",
          fontSize: "1rem",
          marginRight: "0.5rem",
          marginLeft: "0.5rem",
        }}
        to="/boardlist"
      >
        版面列表
      </Link>
      <i className="fa fa-chevron-right" />
      <Link
        style={{ color: "grey", fontSize: "1rem", marginLeft: "0.5rem" }}
        to={`/board/${boardId}`}
      >
        {boardInfo.name}
      </Link>
    </div>
  );
}
