import * as React from "react";

import type { RecommendedTopic } from "@legacy/Props/RecommendedTopic";

import styles from "./FocusTopicItem.module.scss";

/**
 * 随机精选（推荐）的单个主题
 */
export function RecommendedTopicItem({ topic, content }: RecommendedTopic) {
  const topicUrl = `/topic/${topic.id}/1`;
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
        <div className={styles["focus-topic-info"]}>
          <div>
            <i className="fa fa-clock-o fa-lg"></i>
            {topic.time}
          </div>
          <div className={styles["focus-topic-content"]}>
            <i className="fa fa-commenting-o fa-lg"></i>
            {content}
          </div>
        </div>
      </div>
      <div className={styles["focus-topic-rightBar"]}></div>
      <a className={styles["focus-topic-right"]} href={boardUrl} target="_blank">
        <div className={styles["focus-topic-board"]}>{topic.boardName}</div>
      </a>
    </div>
  );
}
