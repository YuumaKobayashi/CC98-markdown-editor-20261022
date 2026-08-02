import * as React from "react";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import $ from "jquery";

import { isMaster } from "@modules/board";
import { FloorSize } from "@modules/post";
import {
  getCurUserTopicContent,
  getHotReplyContent,
  getTopicContent,
  getTraceTopics,
} from "@modules/topic";
import { getMyInfo } from "@modules/session";
import { queryWealth } from "@modules/wealth";
import { PostRatingDialog } from "@modules/post-rating";
import { PostManagementDialog } from "@modules/moderation";
import { TopicAwardList } from "./TopicAwardList";
import { TopicReplier } from "./TopicReplier";
import { TopicReplyContent } from "./TopicReplyContent";
import { TopicReplySignature } from "./TopicReplySignature";
import styles from "./TopicReplyList.module.scss";

export { FloorSize } from "@modules/post";

export interface TopicReplyListProps {
  topicId: any;
  page: any;
  topicInfo: any;
  boardInfo: any;
  quote: (...args: any[]) => void;
  isTrace: any;
  isHot: any;
  postId: any;
}

export function TopicReplyList(props: TopicReplyListProps) {
  const {
    topicId,
    page,
    topicInfo,
    boardInfo,
    quote,
    isTrace,
    isHot,
    postId,
  } = props;
  const [boardName, setBoardName] = useState("");
  const [maxWealth, setMaxWealth] = useState(20000);
  const [deductedWealth, setDeductedWealth] = useState(0);
  const [inWaiting, setInWaiting] = useState(true);
  const [contents, setContents] = useState<any[]>([]);
  const [postManagementVisible, setPostManagementVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  useEffect(() => {
    const loadReplies = async () => {
      const currentPage = page || 1;
      let realContents;
      if (isHot) {
        realContents = await getHotReplyContent(topicId);
        if (!realContents) {
          setInWaiting(false);
          setContents([]);
        }
      } else if (!isTrace) {
        realContents = await getTopicContent(topicId, currentPage);
        if (!realContents) {
          setInWaiting(false);
          setContents([]);
        }
      } else {
        realContents = await getTraceTopics(topicId, postId, currentPage);
      }

      let data = {
        rewardMaxValue: 20000,
        rewardTotalValue: 0,
        boardName: boardInfo.name,
      };
      if (isMaster(boardInfo.boardMasters)) {
        data = await queryWealth(boardInfo.id);
      }
      setMaxWealth(data.rewardMaxValue);
      setDeductedWealth(data.rewardTotalValue);
      setBoardName(data.boardName);
      setInWaiting(false);
      setContents(realContents);
    };

    setInWaiting(true);
    void loadReplies();
  }, [page, topicInfo.replyCount]);

  useEffect(() => {
    if (window.location.hash && window.location.hash !== "#") {
      const hash = window.location.hash;
      const elementId = hash.split("#");
      let id = elementId[1];
      if (id === "10") {
        id = "0";
      }
      const element = document.getElementById(id);
      if (element) {
        const top = element.offsetTop;
        const height = element.clientHeight;
        const viewportHeight = window.innerHeight;
        if (height > viewportHeight) {
          $(document).scrollTop(top);
        } else {
          const delta = (viewportHeight - height) / 2;
          $(document).scrollTop(top - delta);
        }
      }
    }
  });

  const update = async () => {
    const currentPage = page || 1;
    let realContents;
    if (isHot) {
      realContents = await getHotReplyContent(topicId);
    } else if (isTrace) {
      realContents = await getCurUserTopicContent(topicId, currentPage, postId);
    } else {
      realContents = await getTopicContent(topicId, currentPage);
    }

    let data = {
      rewardMaxValue: 0,
      rewardTotalValue: 0,
      boardName: boardInfo.name,
    };
    if (isMaster(boardInfo.boardMasters)) {
      data = await queryWealth(boardInfo.id);
    }
    setMaxWealth(data.rewardMaxValue);
    setDeductedWealth(data.rewardTotalValue);
    setBoardName(data.boardName);
    setContents(realContents);
  };

  const renderReply = (item: any) => {
    const id = isTrace ? item.floor : item.floor % 10;
    let replyId = id.toString();
    const likeInfo = {
      likeCount: item.likeCount,
      dislikeCount: item.dislikeCount,
      likeState: item.likeState,
    };
    const awards =
      item.awards && item.awards.length !== 0 ? (
        <TopicAwardList
          key={Date.now()}
          postId={item.postId}
          updateTime={Date.now()}
          awardInfo={item.awards}
        />
      ) : null;

    const replyBody = (
      <>
        <TopicReplier
          key={item.postId}
          isAnonymous={item.isAnonymous}
          topicInfo={topicInfo}
          userInfo={item.userInfo}
          traceMode={isTrace ? true : false}
          isHot={isHot ? true : false}
        />
        <div
          className="cc98-column"
          style={{
            justifyContent: "space-between",
            width: "55.5rem",
            position: "relative",
          }}
        >
          <TopicReplyContent
            floor={item.floor}
            topicInfo={topicInfo}
            key={item.content}
            postId={item.postId}
            content={item.content}
            contentType={item.contentType}
          />
          {awards}
          <TopicReplySignature
            userInfo={item.userInfo}
            quote={quote}
            boardInfo={boardInfo}
            postInfo={item}
            likeInfo={likeInfo}
            traceMode={isTrace ? true : false}
            topicInfo={topicInfo}
            changePmVisible={(visible, selected) => {
              setPostManagementVisible(visible);
              setSelectedItem(selected);
            }}
            changeJudgeVisible={(visible, selected) => {
              setRatingVisible(visible);
              setSelectedItem(selected);
            }}
            page={item.floor === 1 && !isTrace ? undefined : page}
          />
        </div>
      </>
    );

    if (item.floor === 1 && !isTrace) {
      return (
        <div
          key={replyId}
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div className={styles.reply} id={id.toString()}>
            {replyBody}
            <FloorSize isHot={isHot} floor={item.floor} />
          </div>
          <TopicReplyList
            topicInfo={topicInfo}
            page={page}
            boardInfo={boardInfo}
            quote={quote}
            isTrace={false}
            isHot={true}
            postId={null}
            topicId={topicId}
          />
        </div>
      );
    }

    if (isHot) {
      replyId = `hot_${id}`;
    }
    return (
      <div className={styles.reply} key={replyId} id={replyId}>
        {replyBody}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <FloorSize isHot={isHot} floor={item.floor} />
          {item.isLZ && <FloorSize isHot={false} floor={-1} />}
        </div>
      </div>
    );
  };

  //TODO: getMyInfo() should be called once and stored in a state or context to avoid multiple calls and improve performance.
  const myInfo = getMyInfo();
  const privilege = myInfo ? myInfo.privilege : null;

  if (isHot && inWaiting) return null;
  if (inWaiting) {
    return <Spin style={{ marginTop: "4rem" }} size="large" />;
  }
  if (!contents || !contents.length) {
    return <div></div>;
  }

  return (
    <div className={styles.center} style={{ width: "71rem", marginRight: "1px" }}>
      {contents.map(renderReply)}
      {postManagementVisible && (
        <PostManagementDialog
          m_wealth={maxWealth}
          d_wealth={deductedWealth}
          boardName={boardName}
          update={update}
          privilege={privilege}
          boardId={boardInfo.id}
          item={selectedItem}
          visible={postManagementVisible}
          onCancel={() => setPostManagementVisible(false)}
        />
      )}
      <PostRatingDialog
        item={selectedItem}
        update={update}
        onCancel={() => setRatingVisible(false)}
        visible={ratingVisible}
      />
    </div>
  );
}

export class ContentState {
  id: number;
  content: string;
  time: string;
  isDeleted: boolean;
  floor: number;
  isAnonymous: boolean;
  lastUpdateAuthor: string;
  lastUpdateTime: string;
  topicId: number;
  userName: string;
  sendTopicNumber: number;
  userImgUrl: string;
  signature: string;
  userId: number;
  privilege: string;
  likeNumber: number;
  dislikeNumber: number;
  postId: number;
  contentType: number;
  popularity: number;
}
