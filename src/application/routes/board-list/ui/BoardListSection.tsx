import * as React from "react";
import { Link } from "react-router";

import type { RootBoardState } from "../model/board-list";
import layoutStyles from "./BoardListSection.module.scss";
import { ChildBoardList } from "./ChildBoardList";

interface BoardListSectionProps {
  data: RootBoardState;
}

export function BoardListSection({ data }: BoardListSectionProps) {
  //默认状态为展开
  const [isExpanded, setIsExpanded] = React.useState(true);

  const toggleIsExpanded = () => {
    setIsExpanded((previousValue) => !previousValue);
  };

  const renderMaster = (name: string, index: number, masters: string[]) => {
    const masterUrl = `/user/name/${encodeURIComponent(name)}`;
    if (index === masters.length - 1) {
      return (
        <Link key={index} to={masterUrl}>
          {name}
        </Link>
      );
    }

    return (
      <div key={index} style={{ marginRight: "1rem" }}>
        <Link to={masterUrl}>{name}</Link>
      </div>
    );
  };

  const display = isExpanded ? "flex" : "none";
  const buttonContent = isExpanded ? "收起" : "展开";
  const mastersText = data.masters.length ? "主管：" : "";

  return (
    <div className={layoutStyles.anArea} id={data.name}>
      <div className="cc98-column" style={{ border: "2px solid #e9e9e9" }}>
        <div
          className={`cc98-row ${layoutStyles.boardListHead}`}
          onClick={toggleIsExpanded}
        >
          <div
            className="cc98-row"
            style={{ marginRight: "1rem", alignItems: "center" }}
          >
            <div className={layoutStyles.areaName}>{data.name}</div>
            <div className={layoutStyles.areaName}>
              {mastersText}
              {data.masters.map(renderMaster)}
            </div>
          </div>
          <div className={layoutStyles.expendBoardList}> {buttonContent}</div>
        </div>
        <div className="hiddenContent" style={{ display }}>
          <ChildBoardList id={data.id} boards={data.boards} />
        </div>
      </div>
    </div>
  );
}
