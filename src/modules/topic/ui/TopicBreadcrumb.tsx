import * as React from "react";
import { Link } from "react-router";

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
      <Link
        style={{
          color: "grey",
          fontSize: "1rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
        to="/boardlist"
      >
        版面列表
      </Link>
      <i className="fa fa-chevron-right"></i>
      <Link
        style={{
          color: "grey",
          fontSize: "1rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
        to={listUrl}
      >
        {boardInfo.name}
      </Link>
      <i className="fa fa-chevron-right"></i>
      <Link
        style={{
          color: "grey",
          fontSize: "1rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
        to={topicUrl}
      >
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "15rem",
            whiteSpace: "nowrap",
          }}
        >
          {topicInfo.title}
        </div>
      </Link>
    </div>
  );
}
