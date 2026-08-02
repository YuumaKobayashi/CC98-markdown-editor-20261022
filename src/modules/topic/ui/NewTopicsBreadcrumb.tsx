import * as React from "react";
import { Link } from "react-router";

/**
 * 导航器组件
 */
export function NewTopicsBreadcrumb() {
  return (
    <div
      className="cc98-row"
      style={{
        alignItems: "baseline",
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
      <div
        style={{
          color: "grey",
          fontSize: "1rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
      >
        查看新帖
      </div>
    </div>
  );
}
