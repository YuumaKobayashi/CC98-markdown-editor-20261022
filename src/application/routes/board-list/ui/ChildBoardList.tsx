import * as React from "react";
import { Link } from "react-router";

import styles from "./ChildBoardList.module.scss";
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
      <div className={styles.areaContent}>
        {boards.map((item) => (
          <div key={item.id} className={styles.noImgBoardContent}>
            <Link to={`/board/${item.id}`}>
              <div className={styles.boardName2}>{item.name}</div>
            </Link>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.areaContent}>
      {boards.map((item) => (
        <div key={item.id} className={styles.boardContent}>
          <Link to={`/board/${item.id}`}>
            <div className={styles.greenBackdrop}>
              <img
                className={styles.boardImage}
                src={`/static/images/_${item.name}.png`}
                onError={handleImageError}
              />
            </div>
          </Link>
          <div className={styles.boardBlock}>
            <Link to={`/board/${item.id}`}>
              <div className={`${styles.boardName2} ${styles.boardNameWithImage}`}>
                {item.name}
              </div>
            </Link>
            <div className={styles.boardInfo}>
              <div className={styles.boardStat}>今日 {item.todayCount} </div>
              <div className={styles.boardStat}>总数 {item.postCount}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
