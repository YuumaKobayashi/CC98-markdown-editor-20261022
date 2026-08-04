import * as React from "react";
import type { TopicInfo } from "@modules/topic/model/dto";

import styles from "./BoardTopicList.module.scss";
import { BoardTopicListItem } from "./BoardTopicListItem";

interface BoardTopicListProps {
  list: TopicInfo[];
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
