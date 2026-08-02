import * as React from "react";
import { useEffect, useRef, useState } from "react";

import {
  RecommendedTopicItem,
  RecommendedTopicsBreadcrumb,
} from "@modules/topic";
import { getRandomRecommendedTopic } from "@modules/topic";
import type { RecommendedTopic } from "@modules/topic";
import {
  getStorage,
  removeStorage,
  setStorage,
} from "@foundation/storage/web-storage";
import { CollectionPageShell } from "@application/layouts/collection";

import styles from "./RecommendedTopicsPage.module.scss";

const renderRecommendedTopic = (item: RecommendedTopic) => (
  <RecommendedTopicItem
    key={item.topic.id}
    topic={item.topic}
    content={item.content}
  />
);

/**
 * 全站随机精选主题页面。
 */
export function RecommendedTopicsPage() {
  const [data, setData] = useState<RecommendedTopic[]>([]);
  const [isPreviousVisible, setIsPreviousVisible] = useState(false);
  const isLoadableRef = useRef(true);

  useEffect(() => {
    const loadTopics = async () => {
      let topics = getStorage("CurrentRecommendedTopics");
      if (!topics) {
        isLoadableRef.current = false;
        try {
          topics = await getRandomRecommendedTopic(10);
        } catch {
          isLoadableRef.current = true;
          return;
        }
        setStorage("CurrentRecommendedTopics", topics);
        setData(topics);
        isLoadableRef.current = true;
      } else {
        setData(topics);
      }
    };

    void loadTopics();
  }, []);

  const getNewRandomRecommendedTopics = async () => {
    if (!isLoadableRef.current) {
      return;
    }

    isLoadableRef.current = false;
    let newData: RecommendedTopic[];
    try {
      newData = await getRandomRecommendedTopic(10);
    } catch {
      isLoadableRef.current = true;
      return;
    }
    setStorage(
      "LastRecommendedTopics",
      getStorage("CurrentRecommendedTopics")
    );
    setStorage("CurrentRecommendedTopics", newData);
    setData(newData);
    setIsPreviousVisible(true);
    isLoadableRef.current = true;
  };

  const getLastRecommendedTopics = async () => {
    const previousData = getStorage("LastRecommendedTopics");
    if (previousData) {
      setIsPreviousVisible(false);
      setData(previousData);
      setStorage("CurrentRecommendedTopics", previousData);
      removeStorage("LastRecommendedTopics");
    }
  };

  return (
    <CollectionPageShell documentTitle="随机精选 - CC98论坛">
      <RecommendedTopicsBreadcrumb />
      <div className={styles["recommendation-button-area"]}>
          <button
            className={styles["recommendation-button"]}
            id="recommendation-refresh"
            onClick={getNewRandomRecommendedTopics}
          >
            <i className="fa fa-refresh fa-md" />
            换一换
          </button>
          <button
            className={styles["recommendation-button"]}
            id="recommendation-last"
            hidden={!isPreviousVisible}
            onClick={getLastRecommendedTopics}
          >
            <i className="fa fa-hand-o-left fa-md" />
            上一批
          </button>
      </div>
      <div className={styles["focus-topic-area"]}>
        <div className={styles["focus-topic-topicArea"]}>
          {data.map(renderRecommendedTopic)}
        </div>
      </div>
    </CollectionPageShell>
  );
}
