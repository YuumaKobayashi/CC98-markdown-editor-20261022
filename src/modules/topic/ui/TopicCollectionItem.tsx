import * as React from "react";

import styles from "./TopicCollectionItem.module.scss";

interface TopicCollectionItemData {
  id: number;
  boardId: number;
  boardName: string;
  userId: number;
  userName: string;
  portraitUrl: string;
  title: string;
}

interface TopicCollectionItemProps {
  topic: TopicCollectionItemData;
  topicUrl: string;
  children: React.ReactNode;
}

/** 关注、搜索与随机精选主题共同的条目骨架。 */
export function TopicCollectionItem({
  topic,
  topicUrl,
  children,
}: TopicCollectionItemProps) {
  const userUrl = `/user/id/${topic.userId}`;
  const boardUrl = `/board/${topic.boardId}`;

  return (
    <div className={styles["focus-topic"]}>
      <a
        className={styles["focus-topic-left"]}
        href={topic.userId ? userUrl : undefined}
        target={topic.userId ? "_blank" : undefined}
        id={`user_${topic.id}`}
      >
        <img className={styles["focus-topic-portraitUrl"]} src={topic.portraitUrl}></img>
        <div className={styles["focus-topic-userName"]}>{topic.userName}</div>
      </a>
      <div className={styles["focus-topic-middle"]}>
        <a className={styles["focus-topic-title"]} href={topicUrl} target="_blank">
          {topic.title.trim() ? (
            topic.title
          ) : (
            <span style={{ display: "inline-block", width: "5rem" }}></span>
          )}
        </a>
        <div className={styles["focus-topic-info"]}>{children}</div>
      </div>
      <div className={styles["focus-topic-rightBar"]}></div>
      <a className={styles["focus-topic-right"]} href={boardUrl} target="_blank">
        <div className={styles["focus-topic-board"]}>{topic.boardName}</div>
      </a>
    </div>
  );
}
