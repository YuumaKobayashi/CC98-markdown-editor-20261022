import * as React from "react";
import { Link } from "react-router";

interface EditorBreadcrumbProps {
  url: string;
  boardName: string;
  mode: string;
}

export function EditorBreadcrumb({
  url,
  boardName,
  mode,
}: EditorBreadcrumbProps): React.ReactElement {
  const [current, setCurrent] = React.useState({
    url: "",
    boardName: "",
  });

  React.useEffect(() => {
    setCurrent({ url, boardName });
  }, [url, boardName]);

  let categoryText: string;
  if (mode === "postTopic") categoryText = "发表主题";
  else if (mode === "edit") categoryText = "编辑主题";
  else if (mode === "postVoteTopic") categoryText = "发表投票主题";

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
      <Link
        style={{
          color: "grey",
          fontSize: "1rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
        to={current.url}
      >
        {current.boardName}
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
        {categoryText}
      </div>
    </div>
  );
}
