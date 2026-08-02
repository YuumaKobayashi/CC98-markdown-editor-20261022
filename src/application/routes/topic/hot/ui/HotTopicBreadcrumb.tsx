import * as React from "react";
import { Link } from "react-router";

interface HotTopicBreadcrumbProps {
  label: string;
}

/**
 * 导航器组件
 */
export function HotTopicBreadcrumb({ label }: HotTopicBreadcrumbProps) {
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
      <i className="fa fa-chevron-right"></i>
      <div
        style={{
          color: "grey",
          fontSize: "1rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}
