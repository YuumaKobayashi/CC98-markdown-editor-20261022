import * as React from "react";

import type { FocusTopic } from "../model/view-model";

import { TopicCollectionItem } from "./TopicCollectionItem";
import styles from "./SearchTopicItem.module.scss";

/**
 * 我关注的某个版面的单个主题
 */
export function SearchTopicItem(props: FocusTopic) {
  const tagInfo = props.tag1Name
    ? `标签：${props.tag1Name}${props.tag2Name ? ` / ${props.tag2Name}` : ""}`
    : "";
  const topicUrl = `/topic/${props.id}`;
  const lastPostUserUrl = `/user/name/${encodeURI(props.lastPostUser)}`;

  return (
    <TopicCollectionItem topic={props} topicUrl={topicUrl}>
      <div
        id={`tag_${props.id}`}
        className={props.tag1Name ? undefined : styles.displayNone}
      >
        {tagInfo}
      </div>
      <div>
        <i className="fa fa-clock-o fa-lg"></i>
        {props.displayTime}
      </div>
      <div>
        <i className="fa fa-eye fa-lg"></i> {props.displayHitCount}
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
