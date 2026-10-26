import * as React from "react";
import { Link } from "react-router";

import styles from "./EditorBreadcrumb.module.scss";

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
    <div className={styles.root}>
      <Link className={styles.homeLink} to="/">
        首页
      </Link>
      <i className="fa fa-chevron-right" />
      <Link className={styles.boardLink} to={current.url}>
        {current.boardName}
      </Link>
      <i className="fa fa-chevron-right" />
      <div className={styles.category}>{categoryText}</div>
    </div>
  );
}
