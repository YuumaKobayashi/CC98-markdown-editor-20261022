import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import moment from "moment";
import $ from "jquery";

import { isMaster } from "@modules/board";
import { getMyInfo } from "@modules/session";
import {
  dislike,
  like,
  refreshLikeState,
} from "@modules/reaction";
import { noticeMessageShow } from "@modules/notification";
import { NoticeMessage } from "@legacy/Components/NoticeMessage";
import { UbbCodeOptions, UbbContainer } from "@modules/ubb";
import { QuoteContext, QuoteTraceContext } from "../model/quote-context";
import styles from "./TopicReplySignature.module.scss";

export interface TopicReplySignatureProps {
  postInfo: any;
  topicInfo: any;
  boardInfo: any;
  likeInfo: any;
  quote: (...args: any[]) => void;
  userInfo: any;
  traceMode: any;
  changePmVisible: (visible: boolean, item: any) => void;
  changeJudgeVisible: (visible: boolean, item: any) => void;
  page?: any;
}

export function TopicReplySignature(props: TopicReplySignatureProps) {
  const {
    postInfo,
    topicInfo,
    boardInfo,
    likeInfo,
    userInfo,
    traceMode,
    changePmVisible,
    changeJudgeVisible,
  } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const handleTopicQuote = useContext(QuoteContext);
  const handleTraceQuote = useContext(QuoteTraceContext);
  const [likeNumber, setLikeNumber] = useState(likeInfo.likeCount);
  const [dislikeNumber, setDislikeNumber] = useState(likeInfo.dislikeCount);
  const [likeState, setLikeState] = useState(likeInfo.likeState);

  useEffect(() => {
    const manageId = `#icon${postInfo.id}`;
    if (
      isMaster(boardInfo.boardMasters) ||
      (boardInfo.id == 144 && postInfo.isLZ)
    ) {
      $(manageId).css("display", "");
    }
  }, [boardInfo.boardMasters, boardInfo.id, postInfo.id, postInfo.isLZ]);

  const isAllowedToEdit = (userPrivilege: any) => {
    const myInfo = getMyInfo();
    if (myInfo) {
      const myPrivilege = myInfo.privilege;
      if (myPrivilege === "管理员") return true;
      if (userPrivilege === "管理员") return false;
      if (isMaster(boardInfo.boardMasters)) return true;
    } else {
      return false;
    }
  };

  const updateLikeState = async () => {
    const data = await refreshLikeState(topicInfo.id, postInfo.id);
    setLikeNumber(data.likeCount);
    setDislikeNumber(data.dislikeCount);
    setLikeState(data.likeState);
  };

  const likePost = async () => {
    const status = await like(topicInfo.id, postInfo.id);
    switch (status) {
      case 200:
        await updateLikeState();
        break;
      case 401:
        noticeMessageShow("notLogOn");
        break;
      case 403:
        noticeMessageShow("tooFast");
        break;
    }
  };

  const dislikePost = async () => {
    const status = await dislike(topicInfo.id, postInfo.id);
    switch (status) {
      case 200:
        await updateLikeState();
        break;
      case 401:
        noticeMessageShow("notLogOn");
        break;
      case 403:
        noticeMessageShow("tooFast");
        break;
    }
  };

  const manageIcon = `icon${postInfo.id}`;
  const idLike = `like${postInfo.id}`;
  const idDislike = `dislike${postInfo.id}`;
  const signature = userInfo.signatureCode ? (
    <div className={styles.signature}>
      <UbbContainer
        isSignature
        code={userInfo.signatureCode}
        options={{
          ...new UbbCodeOptions(),
          allowExternalImage: false,
          allowMarkDown: false,
          maxImageCount: 1,
        }}
      />
    </div>
  ) : null;

  let editIcon = null;
  const myInfo = getMyInfo();
  if (
    myInfo &&
    (isAllowedToEdit(userInfo.privilege) || postInfo.isMe)
  ) {
    editIcon = (
      <Link to={`/editor/edit/${postInfo.id}`}>
        <div className={styles.operation1}> 编辑</div>
      </Link>
    );
  }

  let lastUpdate = null;
  if (postInfo.lastUpdateAuthor && postInfo.lastUpdateTime) {
    const time = moment(postInfo.lastUpdateTime).format("YYYY-MM-DD HH:mm:ss");
    const name =
      userInfo.name === postInfo.lastUpdateAuthor
        ? "作者"
        : postInfo.lastUpdateAuthor;
    lastUpdate = `该帖最后由 ${name} 在 ${time} 编辑`;
  }

  const page = Math.floor((postInfo.floor + 9) / 10);
  const pageFloor = postInfo.floor % 10;
  const returnUrl = `/topic/${topicInfo.id}/${page}#${pageFloor}`;
  const traceUrl = `/topic/${topicInfo.id}/postid/${postInfo.id}`;
  const traceIcon = (
    <div className={styles.operation1}>
      <Link to={traceMode ? returnUrl : traceUrl}>
        {traceMode ? "返回" : "追踪"}
      </Link>
    </div>
  );

  let manageButton = null;
  if (
    isMaster(boardInfo.boardMasters) == true ||
    (boardInfo.id === 144 &&
      myInfo &&
      myInfo.name === topicInfo.userName)
  ) {
    manageButton = (
      <div
        className={styles.operation1}
        id={manageIcon}
        style={{ cursor: "pointer" }}
        onClick={() => changePmVisible(true, postInfo)}
      >
        管理
      </div>
    );
  }

  const handleQuote = () => {
    const contextHandler = location.pathname.toLowerCase().includes("postid")
      ? handleTraceQuote
      : handleTopicQuote;
    contextHandler({
      content: postInfo.content,
      userName: userInfo.name,
      replyTime: postInfo.time,
      floor: postInfo.floor,
      postId: postInfo.id,
    });
    void navigate("#sendTopicInfo");
  };

  return (
    <div
      className="cc98-column"
      style={{ marginTop: "1rem", width: "52rem", marginBottom: "0.5rem" }}
    >
      <div className={styles.comment1}>
        <div
          style={{ width: "40rem", marginLeft: "1.2rem", fontSize: "0.8rem" }}
        >
          <span>
            发表于 {moment(postInfo.time).format("YYYY-MM-DD HH:mm:ss")}
          </span>
          <span style={{ marginLeft: "1rem" }}>{lastUpdate}</span>
        </div>
        <div className="cc98-row" style={{ alignItems: "center" }}>
          <div
            id={idLike}
            className={
              likeState === 1
                ? `${styles.upup} ${styles.redColor}`
                : styles.upup
            }
            style={{ marginRight: "0.7rem" }}
            onClick={likePost}
          >
            <i
              title="赞"
              className={
                likeState === 1
                  ? "fa fa-thumbs-up fa-lg"
                  : "fa fa-thumbs-o-up fa-lg"
              }
            ></i>
            <span className={styles.commentProp}> {likeNumber}</span>
          </div>
          <div
            id={idDislike}
            className={
              likeState === 2
                ? `${styles.downdown} ${styles.redColor}`
                : styles.downdown
            }
            onClick={dislikePost}
          >
            <i
              title="踩"
              className={
                likeState === 2
                  ? "fa fa-thumbs-down fa-lg"
                  : "fa fa-thumbs-o-down fa-lg"
              }
            ></i>
            <span className={styles.commentProp}> {dislikeNumber}</span>
          </div>
          <div id="commentlike" className={styles.commentActions}>
            <div
              className={styles.operation1}
              onClick={() => changeJudgeVisible(true, postInfo)}
            >
              评分
            </div>
            <div className={styles.operation1} onClick={handleQuote}>
              引用
            </div>
            {traceIcon}
            {editIcon}
            {manageButton}
          </div>
        </div>
      </div>
      <div
        className="cc98-row"
        style={{ width: "100%", justifyContent: "center" }}
      >
        {signature}
      </div>
      <NoticeMessage
        text="你的操作太快了，慢慢来。"
        id="tooFast"
        top="33%"
        left="40%"
      />
      <NoticeMessage
        text="未登录或者登录状态异常，请先登录。"
        id="notLogOn"
        top="33%"
        left="40%"
      />
    </div>
  );
}

export default TopicReplySignature;
