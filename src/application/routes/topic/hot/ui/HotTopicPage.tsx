import * as React from "react";

import { FocusTopicItem } from "@modules/topic";
import { getMonthlyHotTopic } from "@modules/topic";
import type { FocusTopic } from "@legacy/Props/FocusTopic";
import { CollectionPageShell } from "@application/layouts/collection";

import styles from "./HotTopicPage.module.scss";

export type HotTopicKind = "weekly" | "monthly" | "history";

interface HotTopicPageProps {
  breadcrumb: React.ReactNode;
  kind: HotTopicKind;
  title: string;
}

/**
 * 单个主题数据转换成单个热门话题组件
 */
const renderFocusTopic = (item: FocusTopic) => (
  <FocusTopicItem
    key={item.id}
    title={item.title}
    hitCount={item.hitCount}
    id={item.id}
    boardId={item.boardId}
    boardName={item.boardName}
    replyCount={item.replyCount}
    userId={item.userId}
    userName={item.userName}
    portraitUrl={item.portraitUrl}
    time={item.time}
    likeCount={item.likeCount}
    dislikeCount={item.dislikeCount}
    lastPostUser={item.lastPostUser}
    lastPostTime={item.lastPostTime}
    tag1={item.tag1}
    tag2={item.tag2}
    floorCount={item.floorCount}
    contentType={item.contentType}
    mediaContent={item.mediaContent}
  />
);

export function HotTopicPage({ breadcrumb, kind, title }: HotTopicPageProps) {
  const [topics, setTopics] = React.useState<FocusTopic[]>([]);

  React.useEffect(() => {
    let ignoreResult = false;

    const loadTopics = async () => {
      const nextTopics = await getMonthlyHotTopic(kind);
      if (!ignoreResult) {
        setTopics(nextTopics);
      }
    };

    void loadTopics();
    return () => {
      ignoreResult = true;
    };
  }, [kind]);

  return (
    <CollectionPageShell documentTitle={`${title} - CC98论坛`}>
      {breadcrumb}
      <div className={styles["focus-topic-area"]}>
        <div className={styles["focus-topic-topicArea"]}>
          {topics.map(renderFocusTopic)}
        </div>
      </div>
    </CollectionPageShell>
  );
}
