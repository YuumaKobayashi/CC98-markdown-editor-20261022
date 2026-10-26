import * as React from "react";

import type { FocusTopic } from "../model/view-model";

import { TopicCollectionItem } from "./TopicCollectionItem";

// 每页 10 楼；将总楼层数转换为最后一条回复所在的页码和楼层锚点。
const getLastPostPageAnchor = (floorCount: number) => {
  const page = Number.parseInt(String(floorCount / 10 + 1), 10);
  const floor = floorCount + 10 - page * 10;

  return floor === 0 ? `${page - 1}#10` : `${page}#${floor}`;
};

/**
 * 我关注的某个版面的单个主题
 */
export function FocusTopicItem(props: FocusTopic) {
  const topicUrl = `/topic/${props.id}/1`;
  const lastPostUrl = `/topic/${props.id}/${getLastPostPageAnchor(
    props.floorCount,
  )}`;
  const lastPostUserUrl = `/user/name/${encodeURI(props.lastPostUser)}`;
  const tagInfo = props.tag1Name
    ? `标签：${props.tag1Name}${props.tag2Name ? ` / ${props.tag2Name}` : ""}`
    : "";

  return (
    <TopicCollectionItem topic={props} topicUrl={topicUrl}>
      {tagInfo && <div>{tagInfo}</div>}
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
      <div>
        <a href={lastPostUrl} target="_blank">
          {props.displayLastPostTime}
        </a>
      </div>
    </TopicCollectionItem>
  );
}
