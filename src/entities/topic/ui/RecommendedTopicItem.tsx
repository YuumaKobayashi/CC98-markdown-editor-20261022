import * as React from "react";

import type { RecommendedTopic } from "@legacy/Props/RecommendedTopic";

/**
 * 随机精选（推荐）的单个主题
 */
export function RecommendedTopicItem({ topic, content }: RecommendedTopic) {
  const topicUrl = `/topic/${topic.id}/1`;
  const userUrl = `/user/id/${topic.userId}`;
  const boardUrl = `/board/${topic.boardId}`;

  return (
    <div className="focus-topic">
      <a
        className="focus-topic-left"
        href={topic.userId ? userUrl : undefined}
        target={topic.userId ? "_blank" : undefined}
        id={`user_${topic.id}`}
      >
        <img className="focus-topic-portraitUrl" src={topic.portraitUrl}></img>
        <div className="focus-topic-userName">{topic.userName}</div>
      </a>
      <div className="focus-topic-middle">
        <a className="focus-topic-title" href={topicUrl} target="_blank">
          {topic.title.trim() ? (
            topic.title
          ) : (
            <span style={{ display: "inline-block", width: "5rem" }}></span>
          )}
        </a>
        <div className="focus-topic-info">
          <div>
            <i className="fa fa-clock-o fa-lg"></i>
            {topic.time}
          </div>
          <div className="focus-topic-content">
            <i className="fa fa-commenting-o fa-lg"></i>
            {content}
          </div>
        </div>
      </div>
      <div className="focus-topic-rightBar"></div>
      <a className="focus-topic-right" href={boardUrl} target="_blank">
        <div className="focus-topic-board">{topic.boardName}</div>
      </a>
    </div>
  );
}
