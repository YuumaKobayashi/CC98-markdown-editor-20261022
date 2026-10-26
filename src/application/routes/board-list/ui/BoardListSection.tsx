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
      <div key={index} className={layoutStyles.master}>
        <Link to={masterUrl}>{name}</Link>
      </div>
    );
  };

  const buttonContent = isExpanded ? "收起" : "展开";
  const mastersText = data.masters.length ? "主管：" : "";

  return (
    <div className={layoutStyles.anArea} id={data.name}>
      <div className={layoutStyles.sectionContent}>
        <div
          className={layoutStyles.boardListHead}
          onClick={toggleIsExpanded}
        >
          <div className={layoutStyles.boardListTitle}>
            <div className={layoutStyles.areaName}>{data.name}</div>
            <div className={layoutStyles.areaName}>
              {mastersText}
              {data.masters.map(renderMaster)}
            </div>
          </div>
          <div className={layoutStyles.expendBoardList}> {buttonContent}</div>
        </div>
        <div
          className={
            isExpanded
              ? layoutStyles.boardListContentOpen
              : layoutStyles.boardListContentClosed
          }
        >
          <ChildBoardList id={data.id} boards={data.boards} />
        </div>
      </div>
    </div>
  );
}
