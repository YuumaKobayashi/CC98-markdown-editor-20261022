import * as React from "react";
import {
  TopicBestState,
  TopicState,
  TopicTopState,
} from "@modules/topic/model/enums";
import { type TopicInfo } from "@modules/topic/model/dto";
import { Popover, Tag, Tooltip } from "antd";
import moment from "moment";
import { Link } from "react-router";

import { getMyInfo } from "@modules/session/api/session";
import { readRawTagInfoCache } from "@modules/topic/cache/tag-cache";

import styles from "./BoardTopicListItem.module.scss";
import { BoardTopicPreviewCard } from "./BoardTopicPreviewCard";

export { BoardTopicPreviewCard } from "./BoardTopicPreviewCard";

interface BoardTopicListItemProps {
  data: TopicInfo;
  order: number;
}

const generateListPager = (item: number, id: number) => {
  const url = `/topic/${id}/${item}`;
  if (item != -1) {
    return (
      <div style={{ marginRight: "0.3rem" }}>
        <Link style={{ color: "#79b8ca" }} to={url}>
          {item}
        </Link>
      </div>
    );
  }
  return <div style={{ marginRight: "0.3rem" }}>...</div>;
};

export function BoardTopicListItem({
  data,
  order,
}: BoardTopicListItemProps) {
  // 普通帖子
  let icon = "normal";
  let iconText = "普通帖子";

  // 自己发的
  let curName;
  if (getMyInfo()) curName = getMyInfo().name;
  if (data.userName === curName) {
    icon = "my";
    iconText = "我的帖子";
  }

  // 热门
  if (data.replyCount > 100) {
    icon = "hot";
    iconText = "热帖";
  }

  // 被锁
  if (data.state === TopicState.Locked) {
    icon = "lock";
    iconText = "已被锁定";
  }

  // 精华
  if (data.bestState === TopicBestState.Best) {
    icon = "star";
    iconText = "精华";
  }

  // 置顶
  switch (data.topState) {
    case TopicTopState.AllTop:
      icon = "top-red";
      iconText = "全站置顶";
      break;
    case TopicTopState.BoardTop:
      icon = "top-orange";
      iconText = "版面置顶";
      break;
    default:
  }
  const iconSrc = `/static/images/icon/${icon}.png`;

  let bodyClass = "";
  // 决定奇偶斑马纹
  if (order % 2 === 0) {
    bodyClass = `${styles["board-postItem-body"]} ${styles["board-postItem-body-even"]}`;
  } else {
    bodyClass = `${styles["board-postItem-body"]} ${styles["board-postItem-body-odd"]}`;
  }

  // 气泡内容

  const content = <BoardTopicPreviewCard key={data.id} data={data} />;
  let c: any = "#000";
  let b: any = "normal";
  let i: any = "normal";
  if (data.highlightInfo) {
    if (data.highlightInfo.isBold) b = "bold";
    if (data.highlightInfo.isItalic) i = "italic";
    if (data.highlightInfo.color) c = data.highlightInfo.color;
  }

  const count = data.replyCount + 1;
  const totalPage =
    count % 10 === 0 ? count / 10 : (count - (count % 10)) / 10 + 1;

  const pager = [];
  if (totalPage === 1) {
    // pager to be []
  } else if (totalPage <= 7) {
    for (let page = 1; page <= totalPage; page++) pager.push(page);
  } else {
    pager.push(1, 2, 3, 4, -1, totalPage - 2, totalPage - 1, totalPage);
  }

  const tagInfo = readRawTagInfoCache<any[]>();
  let tag1 = "";
  let tag2 = "";

  for (const item of tagInfo) {
    if (item.id === data.tag1) tag1 = `[${item.name}]`;
    if (item.id === data.tag2) tag2 = `[${item.name}]`;
  }
  console.log(tag1);

  return (
    <Popover
      title={
        <Link style={{ lineHeight: "1rem" }} to={`/topic/${data.id}`}>
          {data.title}
        </Link>
      }
      content={content}
      mouseEnterDelay={1.5}
    >
      <div className={bodyClass}>
        <Tooltip title={iconText}>
          <div className={styles["board-postItem-icon"]}>
            <img src={iconSrc} />
          </div>
        </Tooltip>
        <div
          className={styles["board-postItem-title"]}
          style={{ display: "flex" }}
        >
          <Link
            to={`/topic/${data.id}`}
            style={{
              color: c,
              fontWeight: b,
              fontStyle: i,
              marginRight: "0.3rem",
              fontSize: "1rem",
            }}
          >
            {`${tag1}${tag2}`}
            {data.title.trim() ? (
              data.title
            ) : (
              <span style={{ display: "inline-block", width: "5rem" }}></span>
            )}
          </Link>

          {/* <Tag style={{ marginLeft: '1rem' }} color="magenta">
          速览
        </Tag> */}
          {pager.map((page) => generateListPager(page, data.id))}
        </div>

        <div className={styles["board-postItem-right"]}>
          {data.userName ? (
            <Link
              className={styles["board-postItem-userName"]}
              to={`/user/id/${data.userId}`}
            >
              {data.userName}
            </Link>
          ) : (
            <div className={styles["board-postItem-userName"]}>匿名</div>
          )}
          <div className={styles["board-postItem-tags"]}>
            <div className={styles["board-postItem-tag"]}>
              <Tag style={{ width: 60, textAlign: "center" }} color="blue">
                {data.hitCount > 10000
                  ? `${(data.hitCount / 10000).toFixed(0)}万`
                  : data.hitCount}
              </Tag>
            </div>
            <div className={styles["board-postItem-tag"]}>
              <Tag style={{ width: 60, textAlign: "center" }} color="cyan">
                {data.replyCount}
              </Tag>
            </div>
          </div>
          <Link
            to={`/topic/${data.id}/${Math.ceil((data.replyCount + 1) / 10)}`}
          >
            <div className={styles["board-postItem-lastReply"]}>
              <span>{data.lastPostUser}</span>/
              <span>{moment(data.lastPostTime).format("YY-MM-DD HH:mm")}</span>
            </div>
          </Link>
        </div>
      </div>
    </Popover>
  );
}
