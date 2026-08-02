import * as React from "react";
import { Spin } from "antd";
import $ from "jquery";

import { getFocusTopic } from "@modules/topic";
import { FocusTopicItem } from "@modules/topic";
import type { FocusTopic } from "@modules/topic";
import { isBottom } from "@foundation/lib/dom";
import {
  getStorage,
  setStorage,
} from "@foundation/storage/web-storage";

import styles from "./FocusTopicArea.module.scss";

export interface FocusTopicAreaProps {
  id: number;
  name: string;
}

//TODO:逻辑优化

type ScrollButtonState = "show" | "hidden" | null;

// 先看一下有没有缓存的帖子数据。
const getCachedTopics = (boardId: number) =>
  (getStorage(`focusBoard_${boardId}`) as FocusTopic[] | undefined) ?? [];

// 拼接时防止出现重复帖子。
const mergeTopics = (
  currentTopics: FocusTopic[],
  newTopics: FocusTopic[]
) => {
  const firstNewTopicId = newTopics[0].id;
  const duplicateIndex = currentTopics.findIndex(
    (topic) => topic.id === firstNewTopicId
  );
  const keptTopics =
    duplicateIndex === -1
      ? currentTopics
      : currentTopics.slice(0, duplicateIndex);

  return keptTopics.concat(newTopics);
};

// 回到顶部。
const scrollToTop = () => {
  $("body,html").animate({ scrollTop: 0 }, 500);
};

/**
 * 将单个主题数据转换成单个主题组件。
 */
const renderFocusTopic = (item: FocusTopic) => (
  <FocusTopicItem
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
);

/**
 * 表示我关注的版面的主题列表。
 */
export function FocusTopicArea({ id, name }: FocusTopicAreaProps) {
  const [topics, setTopics] = React.useState<FocusTopic[]>(() =>
    getCachedTopics(id)
  );
  const [isStopped, setIsStopped] = React.useState(false);
  const [scrollButtonState, setScrollButtonState] =
    React.useState<ScrollButtonState>(null);
  const requestIdRef = React.useRef(0);
  const fromRef = React.useRef(topics.length);
  const isLoadingRef = React.useRef(false);
  const stoppedRef = React.useRef(false);

  /**
   * 进入页面或关注对象变化时，立即获取 20 条新帖数据。
   */
  React.useEffect(() => {
    const currentRequestId = ++requestIdRef.current;
    const cachedTopics = getCachedTopics(id);

    setTopics(cachedTopics);
    fromRef.current = cachedTopics.length;
    stoppedRef.current = false;
    setIsStopped(false);
    isLoadingRef.current = true;

    const loadInitialTopics = async () => {
      try {
        const data = await getFocusTopic(id, name, 0);
        if (currentRequestId !== requestIdRef.current || !data) return;

        setTopics(data);
        fromRef.current = data.length;
        // 缓存获取到的数据。
        setStorage(`focusBoard_${id}`, data);
      } catch {
        // 保持旧页面不新增错误 UI，失败后只释放加载锁以允许再次触发。
      } finally {
        if (currentRequestId === requestIdRef.current) {
          isLoadingRef.current = false;
        }
      }
    };

    void loadInitialTopics();

    return () => {
      ++requestIdRef.current;
      isLoadingRef.current = false;
    };
  }, [id, name]);

  /**
   * 获取新帖子的函数。
   */
  const fetchMoreTopics = React.useCallback(async () => {
    // 控制获取新帖。
    if (!isBottom() || isLoadingRef.current) return;

    /**
     * 查看新帖数目大于 200 条时不再继续加载，
     * 或者加载时已经加载完了。
     */
    if (stoppedRef.current || fromRef.current > 199) {
      stoppedRef.current = true;
      setIsStopped(true);
      return;
    }

    const currentRequestId = requestIdRef.current;
    // 发出请求前加锁，防止滚动事件重复发送请求。
    isLoadingRef.current = true;

    try {
      const newTopics = await getFocusTopic(id, name, fromRef.current);
      if (
        currentRequestId !== requestIdRef.current ||
        !newTopics
      ) {
        return;
      }

      if (newTopics.length === 0) {
        stoppedRef.current = true;
        setIsStopped(true);
        return;
      }

      setTopics((currentTopics) => {
        // 正确获取数据后，拼接新数据、更新偏移量并刷新缓存。
        const mergedTopics = mergeTopics(currentTopics, newTopics);
        fromRef.current = mergedTopics.length;
        setStorage(`focusBoard_${id}`, mergedTopics);
        return mergedTopics;
      });
    } catch {
      // 保持旧页面不新增错误 UI，失败后只释放加载锁以允许再次触发。
    } finally {
      if (currentRequestId === requestIdRef.current) {
        isLoadingRef.current = false;
      }
    }
  }, [id, name]);

  React.useEffect(() => {
    const handleLoadTrigger = () => {
      void fetchMoreTopics();
    };
    const handleScroll = () => {
      // 控制回到顶部按钮出现。
      if (window.scrollY > 234) {
        setScrollButtonState("show");
      } else if (window.scrollY < 234) {
        // 控制回到顶部按钮消失。
        setScrollButtonState("hidden");
      }
    };

    // 获取新帖触发事件监听。
    document.addEventListener("wheel", handleLoadTrigger, { passive: true });
    document.addEventListener("touchmove", handleLoadTrigger, {
      passive: true,
    });
    document.addEventListener("scroll", handleLoadTrigger, { passive: true });
    // 滚动条事件监听。
    document.addEventListener("scroll", handleScroll);

    // 移除 DOM 时，为滚动条和获取新帖移除相关监听事件。
    return () => {
      document.removeEventListener("wheel", handleLoadTrigger);
      document.removeEventListener("touchmove", handleLoadTrigger);
      document.removeEventListener("scroll", handleLoadTrigger);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchMoreTopics]);

  const scrollButtonClassName =
    scrollButtonState === null
      ? styles["top-button"]
      : `${styles["top-button"]} ${
          scrollButtonState === "show" ? styles["btn-show"] : styles["btn-disappear"]
        }`;

  // 将主题排列好。
  return (
    <div>
      <div className={styles["focus-topic-area"]}>
        <div className={styles["focus-topic-topicArea"]}>
          {topics.map(renderFocusTopic)}
        </div>
        <div
          className={`${styles["focus-topic-loading"]}${
            isStopped ? ` ${styles.displayNone}` : ""
          }`}
          id="focus-topic-loading"
        >
          <Spin size="large" />
        </div>
        <div
          className={`${styles["focus-topic-loaddone"]}${
            isStopped ? "" : ` ${styles.displayNone}`
          }`}
          id="focus-topic-loaddone"
        >
          无法加载更多了，小水怡情，可不要沉迷哦~
        </div>
        <button
          type="button"
          id="scroll-to-top-button"
          className={scrollButtonClassName}
          onClick={scrollToTop}
        >
          <div style={{ display: "flex" }}>回到顶部</div>
        </button>
      </div>
    </div>
  );
}
