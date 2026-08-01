import * as React from "react";

import type { FocusTopic } from "@legacy/Props/FocusTopic";

import styles from "./FocusTopicItem.module.scss";

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
  const userUrl = `/user/id/${props.userId}`;
  const boardUrl = `/board/${props.boardId}`;
  const lastPostUrl = `/topic/${props.id}/${getLastPostPageAnchor(
    props.floorCount,
  )}`;
  const lastPostUserUrl = `/user/name/${encodeURI(props.lastPostUser)}`;
  const tagInfo = props.tag1
    ? `标签：${props.tag1}${props.tag2 ? ` / ${props.tag2}` : ""}`
    : "";

  return (
    <div className={styles["focus-topic"]}>
      <a
        className={styles["focus-topic-left"]}
        href={props.userId ? userUrl : undefined}
        target={props.userId ? "_blank" : undefined}
        id={`user_${props.id}`}
      >
        <img className={styles["focus-topic-portraitUrl"]} src={props.portraitUrl}></img>
        <div className={styles["focus-topic-userName"]}>{props.userName}</div>
      </a>
      <div className={styles["focus-topic-middle"]}>
        <a className={styles["focus-topic-title"]} href={topicUrl} target="_blank">
          {props.title.trim() ? (
            props.title
          ) : (
            <span style={{ display: "inline-block", width: "5rem" }}></span>
          )}
        </a>
        <div className={styles["focus-topic-info"]}>
          {tagInfo && <div>{tagInfo}</div>}
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
          <div>
            <a href={lastPostUrl} target="_blank">
              {props.lastPostTime}
            </a>
          </div>
        </div>
      </div>
      <div className={styles["focus-topic-rightBar"]}></div>
      <a className={styles["focus-topic-right"]} href={boardUrl} target="_blank">
        <div className={styles["focus-topic-board"]}>{props.boardName}</div>
      </a>
    </div>
  );
}
