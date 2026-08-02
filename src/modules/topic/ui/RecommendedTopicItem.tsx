import * as React from "react";

import type { RecommendedTopic } from "@legacy/Props/RecommendedTopic";

import styles from "./RecommendedTopicItem.module.scss";
import { TopicCollectionItem } from "./TopicCollectionItem";

/**
 * 随机精选（推荐）的单个主题
 */
export function RecommendedTopicItem({ topic, content }: RecommendedTopic) {
  const topicUrl = `/topic/${topic.id}/1`;

  return (
    <TopicCollectionItem topic={topic} topicUrl={topicUrl}>
      <div>
        <i className="fa fa-clock-o fa-lg"></i>
        {topic.time}
      </div>
      <div className={styles["focus-topic-content"]}>
        <i className="fa fa-commenting-o fa-lg"></i>
        {content}
      </div>
    </TopicCollectionItem>
  );
}
