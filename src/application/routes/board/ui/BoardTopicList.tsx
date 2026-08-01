import * as React from "react";
import type { ITopic } from "@cc98/api";

import styles from "../Board.module.scss";
import { BoardTopicListItem } from "./BoardTopicListItem";

interface BoardTopicListProps {
  list: ITopic[];
}

export function BoardTopicList({ list }: BoardTopicListProps) {
  return (
    <div className={styles["board-list-body"]}>
      {list.map((item, index) => (
        <BoardTopicListItem key={index} order={index} data={item} />
      ))}
    </div>
  );
}
