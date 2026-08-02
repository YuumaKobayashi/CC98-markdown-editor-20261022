import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// import { getBoardName } from "@modules/board";
import { getSearchTopic } from "@modules/topic";
import { SearchTopicItem } from "@modules/topic";
import type { FocusTopic } from "@modules/topic";
import { CollectionPageShell } from "@application/layouts/collection";

import styles from "./TopicSearchPage.module.scss";

interface SearchInfo {
  boardId: number;
  // boardName: string;
  words: string[] | null;
}

/**
 * 搜索结果状态机：
 * loading -> 首次请求中；ready -> 已有结果且可以继续加载；
 * loading-more -> 增量请求中；done -> 已有结果且没有更多数据；
 * empty -> 查询无结果或参数无效；error -> 首次请求失败。
 */
type SearchStatus = "loading" | "ready" | "loading-more" | "done" | "empty" | "error";

const parseTopicSearch = (search: string) => {
  const match = search.match(/^\?boardId=(\d+)&keyword=(.*)$/);
  if (!match) return null;
  try {
    const keyword = decodeURI(decodeURI(match[2]));
    return {
      boardId: Number.parseInt(match[1], 10),
      words: keyword.split(" ").slice(0, 5),
    };
  } catch {
    return null;
  }
};

/** 表示搜索结果的帖子列表。 */
export function TopicSearchPage() {
  const location = useLocation();
  const [searchInfo, setSearchInfo] = useState<SearchInfo>({
    boardId: 0,
    // boardName: "全站",
    words: null,
  });
  const [data, setData] = useState<FocusTopic[]>([]);
  const [status, setStatus] = useState<SearchStatus>("loading");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    const parsed = parseTopicSearch(location.search);
    setData([]);

    if (!parsed) {
      const emptySearchInfo: SearchInfo = {
        boardId: 0,
        // boardName: "全站",
        words: null,
      };
      setSearchInfo(emptySearchInfo);
      setStatus("empty");
      return;
    }

    setStatus("loading");
    const load = async () => {
      // const boardName = await getBoardName(parsed.boardId);
      const nextSearchInfo: SearchInfo = {
        ...parsed,
        // boardName,
      };
      if (requestId.current !== currentRequest) return;
      setSearchInfo(nextSearchInfo);

      const result = await getSearchTopic(parsed.boardId, parsed.words, 0);
      if (requestId.current !== currentRequest) return;
      if (result === -1) {
        setStatus("error");
      } else if (!result?.length) {
        setStatus("empty");
      } else {
        setData(result);
        setStatus(result.length < 20 ? "done" : "ready");
      }
    };
    void load();
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 234);
    };
    handleScroll();
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  const getMore = async () => {
    if (status !== "ready" || !searchInfo.words) return;
    const currentRequest = ++requestId.current;
    setStatus("loading-more");
    const result = await getSearchTopic(
      searchInfo.boardId,
      searchInfo.words,
      data.length
    );
    if (requestId.current !== currentRequest) return;
    if (result === -1) {
      setStatus("ready");
    } else if (!result?.length) {
      setStatus("done");
    } else {
      setData((current) => [...current, ...result]);
      setStatus(result.length < 20 ? "done" : "ready");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showResults = status !== "empty" && status !== "error";

  return (
    <CollectionPageShell documentTitle="搜索结果 - CC98论坛">
        <TopicSearchBreadcrumb />
        <div
          className={styles["focus-topic-area"]}
          hidden={!showResults}
          id="focus-topic-area"
        >
          <div className={styles["focus-topic-topicArea"]}>
            {data.map((item) => (
              <SearchTopicItem
                key={item.id}
                title={item.title}
                hitCount={item.hitCount}
                id={item.id}
                boardId={item.boardId}
                boardName={item.boardName}
                replyCount={item.replyCount}
                userId={item.userId}
                userName={item.userName}
                portraitUrl={item.portraitUrl}
                time={item.time}
                likeCount={item.likeCount}
                dislikeCount={item.dislikeCount}
                lastPostUser={item.lastPostUser}
                lastPostTime={item.lastPostTime}
                tag1={item.tag1}
                tag2={item.tag2}
                floorCount={item.floorCount}
                contentType={item.contentType}
                mediaContent={item.mediaContent}
              />
            ))}
          </div>
          <div
            className={styles["focus-topic-getMore"]}
            style={{ display: status === "ready" ? "flex" : "none" }}
            onClick={getMore}
            id="focus-topic-getMore"
          >
            <div>点击获取更多搜索结果~</div>
            <div>······</div>
          </div>
          <div
            className={styles["focus-topic-loading"]}
            hidden={status !== "loading" && status !== "loading-more"}
            id="focus-topic-loading"
          >
            <img src="http://file.cc98.org/uploadfile/2017/12/20/6514723843.gif" />
          </div>
          <div
            className={styles["focus-topic-loaddone"]}
            hidden={status !== "done"}
            id="focus-topic-loaddone"
          >
            没有更多帖子啦~
          </div>
          <button
            type="button"
            id="scroll-to-top-button"
            className={`${styles["top-button"]} ${
              showScrollToTop ? styles["btn-show"] : styles["btn-disappear"]
            }`}
            onClick={scrollToTop}
          >
            <div className={styles["top-button-text"]}>回到顶部</div>
          </button>
        </div>
        <div
          id="noResult"
          className={styles.noResult}
          hidden={status !== "empty"}
        >
          <img src="/static/images/searchNone.png" className={styles.noResultPic} />
          <div className={styles.noResultText}>
            -----------------------抱歉呢前辈，没有找到你想要的帖子哦~----------------------
          </div>
        </div>
        <div id="showError" className="resultErr" hidden={status !== "error"}>
          查询出错了，请刷新重试
        </div>
    </CollectionPageShell>
  );
}

export function TopicSearchBreadcrumb() {
  return (
    <div className="cc98-row" style={{ alignItems: "baseline", justifyContent: "flex-start", color: "grey", fontSize: "0.75rem", marginBottom: "1rem" }}>
      <Link style={{ color: "grey", fontSize: "1rem", marginRight: "0.5rem" }} to="/">首页</Link>
      <i className="fa fa-chevron-right"></i>
      <div style={{ color: "grey", fontSize: "1rem", marginLeft: "0.5rem", marginRight: "0.5rem" }}>搜索主题</div>
    </div>
  );
}
