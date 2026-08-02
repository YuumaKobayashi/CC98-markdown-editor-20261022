import * as React from "react";

import type { FocusTopic } from "@legacy/Props/FocusTopic";

import { TopicCollectionItem } from "./TopicCollectionItem";
import styles from "./SearchTopicItem.module.scss";

/**
 * 我关注的某个版面的单个主题
 */
export function SearchTopicItem(props: FocusTopic) {
  const tagInfo = props.tag1
    ? `标签：${props.tag1}${props.tag2 ? ` / ${props.tag2}` : ""}`
    : "";
  const topicUrl = `/topic/${props.id}`;
  const lastPostUserUrl = `/user/name/${encodeURI(props.lastPostUser)}`;

  return (
    <TopicCollectionItem topic={props} topicUrl={topicUrl}>
      <div
        id={`tag_${props.id}`}
        className={props.tag1 ? undefined : styles.displayNone}
      >
        {tagInfo}
      </div>
      <div>
        <i className="fa fa-clock-o fa-lg"></i>
        {props.time}
      </div>
      <div>
        <i className="fa fa-eye fa-lg"></i> {props.hitCount}
      </div>
      <div>
        最后回复：
        <a
          href={props.userId ? lastPostUserUrl : undefined}
          target={props.userId ? "_blank" : undefined}
          id={`lastpost_${props.id}`}
        >
          {props.lastPostUser}
        </a>
      </div>
    </TopicCollectionItem>
  );
}
