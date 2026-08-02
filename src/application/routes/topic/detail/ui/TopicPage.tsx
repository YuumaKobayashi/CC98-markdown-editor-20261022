import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import $ from "jquery";

import { getBoardInfo, getBoards } from "@modules/board";
import { getTopicInfo } from "@modules/topic";
import { getMyInfo } from "@modules/session";
import { getFavState } from "@modules/favorite-topic";
import { type NoticeSetting } from "@modules/notification";
import { noticeMessageShow } from "@modules/notification";
import { TopicBreadcrumb } from "@modules/topic";
import { Pager } from "@foundation/ui/pagination";
import { getTotalPageof10 } from "@foundation/lib/page";
import { getLocalStorage } from "@foundation/storage/web-storage";
import DocumentTitle from "@legacy/Components/DocumentTitle";
import { NoticeMessage } from "@legacy/Components/NoticeMessage";
import {
  NotFoundTopic,
  ServerError,
  UnauthorizedTopic,
} from "@application/routes/status";
import { QuoteContext, type TopicQuote } from "../model/quote-context";
import { TopicHeader } from "./TopicHeader";
import {
  TopicReplyComposer,
  type TopicReplyComposerHandle,
} from "./TopicReplyComposer";
import { TopicReplyList } from "./TopicReplyList";
import styles from "./TopicPage.module.scss";

type TopicRouteParams = {
  topicid?: string;
  page?: string;
};

type TopicPageState = {
  topicid: any;
  page: any;
  totalPage: any;
  userName: any;
  boardId: any;
  topicInfo: any;
  boardInfo: any;
  fetchState: any;
  quote: TopicQuote | string;
  isFav: any;
  IPData: any[];
};

//TODO: 逻辑需要重新梳理，看一下输入框那边的逻辑咋整比较好
//TODO :Jquery分离
export function TopicPage() {
  const params = useParams<TopicRouteParams>();
  const navigate = useNavigate();
  const [state, setState] = useState<TopicPageState>({
    page: 1,
    topicid: params.topicid,
    totalPage: 1,
    userName: null,
    boardId: 7,
    topicInfo: { replyCount: 0 },
    boardInfo: { masters: [], boardMasters: [], id: 7 },
    fetchState: "ok",
    quote: "",
    isFav: false,
    IPData: [],
  });
  const stateRef = useRef(state);
  stateRef.current = state;
  const replyComposerRef = useRef<TopicReplyComposerHandle>(null);
  const throttlingRef = useRef(false);
  const throttleTimerRef = useRef<number | null>(null);
  const boardsPromiseRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    const loadTopic = async () => {
      if (!boardsPromiseRef.current) {
        boardsPromiseRef.current = getBoards();
      }
      await boardsPromiseRef.current;
      //page 是否变了
      let currentPage: number;
      if (!params.page) {
        currentPage = 1;
      } else {
        currentPage = parseInt(params.page);
      }
      const topicInfo = await getTopicInfo(params.topicid);
      const boardId = topicInfo.boardId;
      const boardInfo = await getBoardInfo(boardId);
      const totalPage = getTotalPageof10(topicInfo.replyCount);
      const floor = (topicInfo.replyCount + 1) % 10;
      //如果page超过最大页码，就跳转到最大页码
      if (currentPage > totalPage) {
        currentPage = totalPage;
        void navigate(`/topic/${topicInfo.id}/${currentPage}#${floor}`);
      }
      const isFav = await getFavState(params.topicid);
      setState((currentState) => ({
        ...currentState,
        isFav,
        page: currentPage,
        topicid: params.topicid,
        totalPage,
        userName: null,
        boardId,
        topicInfo,
        boardInfo,
        fetchState: topicInfo,
        IPData: [],
      }));
    };

    void loadTopic();
  }, [navigate, params.page, params.topicid]);

  useEffect(() => {
    if (state.fetchState === "ok") {
      return;
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== "BODY") return; //如果焦点不在页面上，直接返回
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; //如果不是方向键，直接返回
      if (throttlingRef.current) {
        console.info("切换过于频繁 触发节流");
        // 如果节流标志为true，表示事件正在处理中，直接返回
        return;
      }
      if (!replyComposerRef.current!.isContentEmpty()) {
        //输入内容不为空
        if (!window.confirm("您的输入内容尚未提交，是否翻页？")) {
          return;
        }
      }

      throttlingRef.current = true;
      let currentPage = stateRef.current.page;
      if (event.key === "ArrowLeft" && currentPage > 1) {
        currentPage--;
        window.scroll({ top: 0, left: 0 });
        void navigate(`/topic/${stateRef.current.topicid}/${currentPage}`);
      } else if (
        event.key === "ArrowRight" &&
        currentPage < stateRef.current.totalPage
      ) {
        currentPage++;
        window.scroll({ top: 0, left: 0 });
        void navigate(`/topic/${stateRef.current.topicid}/${currentPage}`);
      }

      // 使用setTimeout来清除节流标志
      throttleTimerRef.current = window.setTimeout(() => {
        throttlingRef.current = false;
      }, 1000); // 1000毫秒是节流的时间间隔
    };

    window.addEventListener("keyup", handleKeyUp); //添加键盘事件监听
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      if (throttleTimerRef.current !== null) {
        window.clearTimeout(throttleTimerRef.current);
      }
    };
  }, [navigate, state.fetchState]);

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
      `/topic/${stateRef.current.topicid}/${currentPage}#sendTopicInfo`
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
    let currentPage = params.page ? parseInt(params.page) : 1;
    const topicInfo = await getTopicInfo(params.topicid);
    const newPage = getTotalPageof10(topicInfo.replyCount);
    const floor = (topicInfo.replyCount + 1) % 10;
    //检查用户是否设置跳转到最新回复
    const noticeSetting = getLocalStorage<NoticeSetting>("noticeSetting");

    setState((currentState) => ({ ...currentState, topicInfo }));
    if (currentPage != newPage) {
      console.log("当前页不是最新一页");
      //如果设置了跳转到最新回复或者刚好翻页，则跳转
      if (
        (noticeSetting && noticeSetting.post === "是") ||
        (newPage == currentPage + 1 && floor == 1)
      ) {
        console.log("要跳转");
        currentPage = newPage || 1;
        setState((currentState) => ({
          ...currentState,
          quote: { userName: "", content: "", replyTime: "", floor: "" },
        }));
        void navigate(`/topic/${topicInfo.id}/${currentPage}#${floor}`);
      } else if (
        //如果是引用了某一层楼，发帖后应该跳转回这层楼
        stateRef.current.quote &&
        typeof stateRef.current.quote !== "string" &&
        stateRef.current.quote.floor
      ) {
        const quoteFloor = stateRef.current.quote.floor % 10;
        currentPage = currentPage || 1;
        setState((currentState) => ({
          ...currentState,
          quote: { userName: "", content: "", replyTime: "", floor: "" },
        }));
        void navigate(`/topic/${topicInfo.id}/${currentPage}#${quoteFloor}`);
      }
      //如果没有引用则不需要跳转，直接还是在输入框那个位置
    } else {
      currentPage = newPage || 1;
      setState((currentState) => ({
        ...currentState,
        quote: { userName: "", content: "", replyTime: "", floor: "" },
      }));
      void navigate(`/topic/${topicInfo.id}/${currentPage}#${floor}`);
    }
    //回复成功提示
    noticeMessageShow("replyMessage");
  };

  switch (state.fetchState) {
    case "ok":
      return <div></div>;
    case "not found":
      return <NotFoundTopic />;
    case "unauthorized":
      return <UnauthorizedTopic />;
    case "server error":
      return <ServerError />;
  }

  const myInfo = getMyInfo();
  let replyComposer = myInfo ? (
    <TopicReplyComposer
      onChange={handleChange}
      boardInfo={state.boardInfo}
      content={state.quote}
      topicInfo={state.topicInfo}
      ref={replyComposerRef}
    />
  ) : (
    <div>您还未登录，无法发言，请先登录。</div>
  );
  if (myInfo && !myInfo.isVerified) {
    replyComposer = (
      <div>
        您的帐号未认证，无法发言，请先前往{" "}
        <a href="https://account.cc98.org">https://account.cc98.org</a>{" "}
        认证激活。
      </div>
    );
  }
  if (myInfo && myInfo.lockState !== 0) {
    replyComposer = <div>您的帐号被全站禁言。</div>;
  }

  const lockedTip =
    state.topicInfo && state.topicInfo.state === 1 ? (
      <div style={{ color: "red", margin: "0.5rem" }}>该帖已被锁定</div>
    ) : null;
  const pagerUrl = `/topic/${state.topicid}/`;

  return (
    <div className={styles.center}>
      <DocumentTitle title={`${state.topicInfo.title || "帖子"} - CC98论坛`} />
      <div className="cc98-column" style={{ width: "100%" }}>
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
            topicId={params.topicid}
          />
          <Pager
            page={state.page}
            url={pagerUrl}
            totalPage={state.totalPage}
          />
        </div>
        {lockedTip}
      </div>
      <TopicHeader
        topicInfo={state.topicInfo}
        tag1={state.topicInfo.tag1}
        tag2={state.topicInfo.tag2}
        boardInfo={state.boardInfo}
        isFav={state.isFav}
      />
      <QuoteContext.Provider value={handleQuoteContextChange}>
        <TopicReplyList
          topicInfo={state.topicInfo}
          page={state.page}
          boardInfo={state.boardInfo}
          quote={quote}
          isHot={false}
          isTrace={false}
          postId={null}
          topicId={params.topicid}
        />
      </QuoteContext.Provider>
      <div className="cc98-column" style={{ width: "100%" }}>
        <div
          className="cc98-row"
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginTop: "2rem",
          }}
        >
          <TopicBreadcrumb
            topicInfo={state.topicInfo}
            boardInfo={state.boardInfo}
            topicId={params.topicid}
          />
          <Pager
            page={state.page}
            url={pagerUrl}
            totalPage={state.totalPage}
          />
        </div>
      </div>
      {replyComposer}
      <NoticeMessage
        text="回复成功"
        id="replyMessage"
        top="24%"
        left="46%"
      />
    </div>
  );
}
