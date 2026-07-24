import * as React from "react";
import { Link } from "react-router";

import type { ChildBoardState } from "../model/board-list";

interface ChildBoardListProps {
  id: number;
  boards: ChildBoardState[];
}

//TODO: hard code here
const noImageAreaIds = new Set([2, 29, 33, 35, 37, 604]);

export function ChildBoardList({ id, boards }: ChildBoardListProps) {
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.preventDefault();
    event.currentTarget.src = "/static/images/_CC98.png";
  };

  if (noImageAreaIds.has(id)) {
    return (
      <div className="areaContent">
        {boards.map((item) => (
          <div key={item.id} className="noImgBoardContent">
            <Link to={`/board/${item.id}`}>
              <div className="boardName2">{item.name}</div>
            </Link>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="areaContent">
      {boards.map((item) => (
        <div key={item.id} className="boardContent">
          <Link to={`/board/${item.id}`}>
            <div className="greenBackdrop">
              <img
                style={{ width: "6rem", height: "6rem" }}
                src={`/static/images/_${item.name}.png`}
                onError={handleImageError}
              />
            </div>
          </Link>
          <div className="column boardBlock">
            <Link to={`/board/${item.id}`}>
              <div
                className="boardName2"
                style={{ fontSize: "1.2rem", fontWeight: "bold" }}
              >
                {item.name}
              </div>
            </Link>
            <div className="boardInfo">
              <div className="row">今日 {item.todayCount} </div>
              <div className="row">总数 {item.postCount}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
