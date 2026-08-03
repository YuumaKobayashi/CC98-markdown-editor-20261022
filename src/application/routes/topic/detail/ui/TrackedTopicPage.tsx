import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import $ from "jquery";

import { getBoardInfo } from "@modules/board";
import {
  getTopicInfo,
  getTraceTopicsCount,
} from "@modules/topic";
import { getFavState } from "@modules/favorite-topic/api/service";
import { noticeMessageShow } from "@modules/notification";
import { TopicBreadcrumb } from "@modules/topic";
import { Pager } from "@foundation/ui/pagination";
import { QuoteTraceContext, type TopicQuote } from "../model/quote-context";
import { TopicHeader } from "./TopicHeader";
import {
  TopicReplyComposer,
  type TopicReplyComposerHandle,
} from "./TopicReplyComposer";
import { TopicReplyList } from "./TopicReplyList";
import styles from "./TrackedTopicPage.module.scss";

type TrackedTopicRouteParams = {
  topicId?: string;
  postId?: string;
  page?: string;
};

type TrackedTopicState = {
  topicId: any;
  page: any;
  totalPage: any;
  topicInfo: any;
  boardInfo: any;
  isFav: any;
  postId: any;
  quote: TopicQuote | string;
};

export function TrackedTopicPage() {
  const params = useParams<TrackedTopicRouteParams>();
  const navigate = useNavigate();
  const [state, setState] = useState<TrackedTopicState>({
    page: 1,
    topicId: params.topicId,
    totalPage: 1,
    postId: params.postId,
    topicInfo: { replyCount: 0, notifyAllReplierPostIds: [] },
    boardInfo: { masters: [], boardMasters: [], id: 7 },
    isFav: false,
    quote: "",
  });
  const stateRef = useRef(state);
  stateRef.current = state;
  const replyComposerRef = useRef<TopicReplyComposerHandle>(null);
  const throttlingRef = useRef(false);
  const throttleTimerRef = useRef<number | null>(null);
  const normalizedPage = params.page ? parseInt(params.page) : 1;

  useEffect(() => {
    const loadTrackedTopic = async () => {
      const currentPage = normalizedPage;
      const shouldLoadFavorite = Boolean(stateRef.current.topicInfo.id);
      const topicInfo = await getTopicInfo(params.topicId);
      const boardInfo = await getBoardInfo(topicInfo.boardId);
      const repeatedTopicInfo = await getTopicInfo(params.topicId);
      const isAnonymous = repeatedTopicInfo.isAnonymous;
      console.log(params.postId);
      const totalPage = await getTraceTopicsCount(
        params.topicId,
        params.postId
      );
      const isFav = shouldLoadFavorite
        ? await getFavState(params.topicId)
        : stateRef.current.isFav;

      void isAnonymous;
      console.log("totalpage=" + totalPage);
      setState((currentState) => ({
        ...currentState,
        page: currentPage,
        topicId: params.topicId,
        totalPage,
        postId: params.postId,
        topicInfo,
        boardInfo,
        isFav,
      }));
    };

    void loadTrackedTopic();
  }, [normalizedPage]);

  useEffect(() => {
    if (!state.topicInfo.id) {
      return;
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== "BODY") return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (throttlingRef.current) {
        console.info("切换过于频繁 触发节流");
        return;
      }
      if (!replyComposerRef.current?.isContentEmpty()) {
        if (!window.confirm("您的输入内容尚未提交，是否翻页？")) {
          return;
        }
      }

      throttlingRef.current = true;
      let currentPage = stateRef.current.page;
      if (event.key === "ArrowLeft" && currentPage > 1) {
        currentPage--;
        window.scroll({ top: 0, left: 0 });
        void navigate(
          `/topic/${stateRef.current.topicId}/postId/${stateRef.current.postId}/${currentPage}`
        );
      } else if (
        event.key === "ArrowRight" &&
        currentPage < stateRef.current.totalPage
      ) {
        currentPage++;
        window.scroll({ top: 0, left: 0 });
        void navigate(
          `/topic/${stateRef.current.topicId}/postId/${stateRef.current.postId}/${currentPage}`
        );
      }

      throttleTimerRef.current = window.setTimeout(() => {
        throttlingRef.current = false;
      }, 1000);
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      if (throttleTimerRef.current !== null) {
        window.clearTimeout(throttleTimerRef.current);
      }
    };
  }, [navigate, state.topicInfo.id]);

  const quote = (
    content: any,
    userName: any,
    replyTime: any,
    floor: any,
    postId: any
  ) => {
    $("#sendTopicInfo").offset().top;
    const currentPage = stateRef.current.page || 1;
    void navigate(
      `/topic/${stateRef.current.topicId}/postId/${stateRef.current.postId}/${currentPage}#sendTopicInfo`
    );
    setState((currentState) => ({
      ...currentState,
      quote: { content, userName, replyTime, floor, postId },
    }));
  };

  const handleQuoteContextChange = (context: TopicQuote) => {
    console.log("传进topic.tsx");
    console.log(context);
    setState((currentState) => ({ ...currentState, quote: context }));
  };

  const handleChange = async () => {
    console.log("handle trace post");
    const topicInfo = await getTopicInfo(params.topicId);
    const pages = 1 + Math.floor(topicInfo.replyCount / 10);
    const floor = (topicInfo.replyCount + 1) % 10;
    setState((currentState) => ({
      ...currentState,
      quote: { userName: "", content: "", replyTime: "", floor: "" },
    }));
    noticeMessageShow("replyMessage");
    void navigate(`/topic/${topicInfo.id}/${pages}#${floor}`);
  };

  const pageUrl = `/topic/${params.topicId}/postId/${params.postId}/`;

  return (
    <div className={styles.center} style={{ width: "1140px" }}>
      <div
        className="cc98-row"
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TopicBreadcrumb
          topicInfo={state.topicInfo}
          boardInfo={state.boardInfo}
          topicId={params.topicId}
        />
        <Pager
          page={state.page}
          url={pageUrl}
          totalPage={state.totalPage}
        />
      </div>
      <TopicHeader
        topicInfo={state.topicInfo}
        tag1={state.topicInfo.tag1}
        tag2={state.topicInfo.tag2}
        boardInfo={state.boardInfo}
        isFav={state.isFav}
      />
      <QuoteTraceContext.Provider value={handleQuoteContextChange}>
        <TopicReplyList
          topicInfo={state.topicInfo}
          boardInfo={state.boardInfo}
          page={state.page}
          postId={state.postId}
          quote={quote}
          isTrace={true}
          isHot={false}
          topicId={params.topicId}
        />
      </QuoteTraceContext.Provider>
      <div
        className="cc98-row"
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <TopicBreadcrumb
          topicInfo={state.topicInfo}
          boardInfo={state.boardInfo}
          topicId={params.topicId}
        />
        <Pager
          page={state.page}
          url={pageUrl}
          totalPage={state.totalPage}
        />
      </div>
      <TopicReplyComposer
        onChange={handleChange}
        boardInfo={state.boardInfo}
        content={state.quote}
        topicInfo={state.topicInfo}
        ref={replyComposerRef}
      />
    </div>
  );
}
