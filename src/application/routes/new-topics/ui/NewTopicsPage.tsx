import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import $ from "jquery";

import { FocusTopicItem } from "@modules/topic/ui/FocusTopicItem";
import { NewTopicsBreadcrumb } from "@modules/topic/ui/NewTopicsBreadcrumb";
import { TopicCard } from "@modules/topic/ui/TopicCard";
import { getAllNewTopic } from "@modules/topic/api/list-search";
import { getMyInfo } from "@modules/session/api/session";
import {
  setShowCardUser,
  useShowCardUser,
} from "@modules/user-preference/persistence/show-card-user";
import { setUserTopicViewMode } from "@modules/user-preference/api/service";
import { isLogOn } from "@modules/session/api/session";
import type { FocusTopic } from "@modules/topic/model/view-model";
import type { CurrentUser } from "@modules/session/model/types";
import { UserTopicViewMode } from "@modules/user/model/enums";
import { CollectionPageShell } from "@application/layouts/collection";
import { pDebounce } from "@foundation/lib/async";
import { isBottom } from "@foundation/lib/dom";
import { setStorage } from "@foundation/storage/web-storage";

import { NewTopicsBoardSidebar } from "./NewTopicsBoardSidebar";
import { RandomRecentTopics } from "./RandomRecentTopics";
import styles from "./NewTopicsPage.module.scss";

//TODO：逻辑重构优化，优先级中

type ScrollButtonState = "show" | "hidden" | null;

const getCountString = (count: number) => {
  if (count > 99999) {
    return `${Math.floor(count / 10000)}万`;
  }
  if (count > 9999) {
    const tenThousands = Math.floor(count / 10000);
    const thousands = Math.floor((count % 10000) / 1000);
    return `${tenThousands}.${thousands}万`;
  }
  return Math.floor(count).toString();
};

const scrollToTop = () => {
  $("body,html").animate({ scrollTop: 0 }, 500);
};

const renderClassicTopic = (item: FocusTopic) => (
  <FocusTopicItem
    key={`classic_topic_${item.id}`}
    isAnonymous={item.isAnonymous}
    title={item.title}
    hitCount={item.hitCount}
    displayHitCount={item.displayHitCount}
    id={item.id}
    boardId={item.boardId}
    boardName={item.boardName}
    replyCount={item.replyCount}
    displayReplyCount={item.displayReplyCount}
    userId={item.userId}
    userName={item.userName}
    portraitUrl={item.portraitUrl}
    time={item.time}
    displayTime={item.displayTime}
    likeCount={item.likeCount}
    dislikeCount={item.dislikeCount}
    lastPostUser={item.lastPostUser}
    lastPostTime={item.lastPostTime}
    displayLastPostTime={item.displayLastPostTime}
    tag1={item.tag1}
    tag1Name={item.tag1Name}
    tag2={item.tag2}
    tag2Name={item.tag2Name}
    floorCount={item.floorCount}
    contentType={item.contentType}
    mediaContent={item.mediaContent}
  />
);

const renderCardTopic = (item: FocusTopic) => (
  <TopicCard key={`card_topic_${item.id}`} {...item} />
);

const renderMediaOnlyTopic = (item: FocusTopic) => (
  <TopicCard key={`card_topic_media_only_${item.id}`} {...item} />
);

/**
 * 全站最新主题页面。
 */
export function NewTopicsPage() {
  const showCardUser = useShowCardUser();
  const [myInfo] = useState<CurrentUser | null>(() =>
    isLogOn() ? getMyInfo() : null
  );
  const initialMode = myInfo?.topicViewMode ?? UserTopicViewMode.Classic;
  const [viewMode, setViewMode] = useState<UserTopicViewMode>(initialMode);
  const [data, setData] = useState<FocusTopic[]>([]);
  const [from, setFrom] = useState(0);
  const [isLoadDone, setIsLoadDone] = useState(false);
  const [scrollButtonState, setScrollButtonState] =
    useState<ScrollButtonState>(null);

  const isLoadableRef = useRef(true);
  const mediaOnlyRef = useRef(
    initialMode === UserTopicViewMode.CardMediaOnly
  );
  const dataRef = useRef(data);
  const fromRef = useRef(from);

  dataRef.current = data;
  fromRef.current = from;

  const getAndSetTopic = async (requestFrom: number) => {
    isLoadableRef.current = false;
    const startTime = Date.now();
    const topics = await getAllNewTopic(
      requestFrom,
      mediaOnlyRef.current
    );
    if (topics) {
      const cacheKey = mediaOnlyRef.current
        ? "AllNewMediaTopic"
        : "AllNewTopic";
      setStorage(cacheKey, topics);
      setData(topics);
      setFrom(topics.length);
    }
    const elapsed = Date.now() - startTime;
    if (elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
    }
    isLoadableRef.current = true;
  };

  const changeMode = async (mode: UserTopicViewMode, isInitial = false) => {
    if (!isLoadableRef.current) {
      return;
    }
    if (!isInitial) {
      void setUserTopicViewMode(mode);
    }
    setViewMode(mode);
    mediaOnlyRef.current = mode === UserTopicViewMode.CardMediaOnly;
    await getAndSetTopic(0);
  };

  useEffect(() => {
    if (!myInfo) {
      return;
    }

    void changeMode(initialMode, true);

    const handleFetchNewTopics = async () => {
      if (!isBottom() || !isLoadableRef.current) {
        return;
      }
      if (fromRef.current > 499) {
        setIsLoadDone(true);
        return;
      }

      isLoadableRef.current = false;
      let newData: FocusTopic[];
      try {
        const debouncedFetch = pDebounce(getAllNewTopic, 1000);
        newData = (await debouncedFetch(
          fromRef.current,
          mediaOnlyRef.current
        )) as FocusTopic[];
      } catch {
        isLoadableRef.current = true;
        return;
      }

      if (newData && newData.length > 0) {
        const currentData = dataRef.current;
        let duplicateIndex = 0;
        for (
          duplicateIndex = 0;
          duplicateIndex < currentData.length;
          duplicateIndex += 1
        ) {
          if (currentData[duplicateIndex].id === newData[0].id) {
            break;
          }
        }
        const mergedData = currentData
          .slice(0, duplicateIndex)
          .concat(newData);
        dataRef.current = mergedData;
        fromRef.current = mergedData.length;
        setData(mergedData);
        setFrom(mergedData.length);
        isLoadableRef.current = true;
        const cacheKey = mediaOnlyRef.current
          ? "AllNewMediaTopic"
          : "AllNewTopic";
        setStorage(cacheKey, mergedData);
      } else {
        isLoadableRef.current = true;
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 234) {
        setScrollButtonState("show");
      }
      if (window.scrollY < 234) {
        setScrollButtonState("hidden");
      }
    };

    document.addEventListener("wheel", handleFetchNewTopics, {
      passive: true,
    });
    document.addEventListener("touchmove", handleFetchNewTopics, {
      passive: true,
    });
    document.addEventListener("scroll", handleFetchNewTopics, {
      passive: true,
    });
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleFetchNewTopics);
      document.removeEventListener("touchmove", handleFetchNewTopics);
      document.removeEventListener("wheel", handleFetchNewTopics);
    };
    // 旧页面只在挂载时读取一次登录信息和视图偏好。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVisibilityChange = (visible: boolean) => {
    debugger;
    setShowCardUser(visible);
  };

  const classicButtonClassName = `${styles["focus-board"]} ${styles["new-topic"]}${
    viewMode === UserTopicViewMode.Classic ? ` ${styles["focus-hover"]}` : ""
  }`;
  const cardButtonClassName = `${styles["focus-board"]} ${styles["new-topic"]}${
    viewMode === UserTopicViewMode.Card ? ` ${styles["focus-hover"]}` : ""
  }`;
  const mediaButtonClassName = `${styles["focus-board"]} ${styles["new-topic"]}${
    viewMode === UserTopicViewMode.CardMediaOnly ? ` ${styles["focus-hover"]}` : ""
  }`;
  const scrollButtonClassName =
    scrollButtonState === "show"
      ? `${styles["top-button"]} ${styles["btn-show"]}`
      : scrollButtonState === "hidden"
        ? `${styles["top-button"]} ${styles["btn-disappear"]}`
        : styles["top-button"];

  return (
    <CollectionPageShell documentTitle="查看新帖 - CC98论坛">
        <NewTopicsBreadcrumb />
        <div className={styles["focus-board-area"]}>
          <button
            className={classicButtonClassName}
            id="new-topic-classic-button"
            onClick={() => changeMode(UserTopicViewMode.Classic)}
          >
            经典模式
          </button>
          <button
            className={cardButtonClassName}
            id="new-topic-card-button"
            onClick={() => changeMode(UserTopicViewMode.Card)}
          >
            卡片模式
          </button>
          <button
            className={mediaButtonClassName}
            id="new-topic-media-only-button"
            onClick={() => changeMode(UserTopicViewMode.CardMediaOnly)}
          >
            只看媒体
          </button>
          <button
            className={styles["refresh-button"]}
            id="new-topic-refresh-button"
            onClick={() => {
              if (isLoadableRef.current) {
                void getAndSetTopic(0);
              }
            }}
          >
            <i className="fa fa-refresh fa-md" />
            刷新
          </button>
        </div>

        <div
          className={styles["focus-topic-area"]}
          id="classic-mode-area"
          style={{ display: viewMode === UserTopicViewMode.Classic ? undefined : "none" }}
        >
          <div className={styles["focus-topic-topicArea"]}>
            {data.map(renderClassicTopic)}
          </div>
        </div>

        <div
          className={styles["card-topic-area"]}
          id="card-mode-area"
          style={{ display: viewMode === UserTopicViewMode.Classic ? "none" : undefined }}
        >
          <div className={styles["card-topic-area-left"]}>
            <div className={styles["card-topic-area-left-content"]}>
              <div className={styles["card-user"]}>
                <div className={styles["card-user-background"]} />
                <div className={styles["card-user-portrait"]}>
                  <img
                    src={
                      myInfo
                        ? showCardUser
                          ? myInfo.portraitUrl
                          : "/static/images/_心灵之约.png"
                        : ""
                    }
                  />
                  <a href="../usercenter" target="_blank">
                    {myInfo
                      ? showCardUser
                        ? myInfo.name
                        : "隐私模式"
                      : ""}
                  </a>
                  {showCardUser ? (
                    <EyeInvisibleOutlined
                      onClick={() => handleVisibilityChange(false)}
                    />
                  ) : (
                    <EyeOutlined
                      onClick={() => handleVisibilityChange(true)}
                    />
                  )}
                </div>
                <div className={styles["card-user-stats"]}>
                  <div className={styles["card-user-stats-item"]}>
                    <a href="../usercenter" target="_blank">
                      {myInfo
                        ? showCardUser
                          ? getCountString(myInfo.postCount)
                          : "--"
                        : ""}
                    </a>
                    帖数
                  </div>
                  <div className={styles["card-user-stats-item"]}>
                    <a href="../usercenter/myfollowings" target="_blank">
                      {myInfo
                        ? showCardUser
                          ? getCountString(myInfo.followCount)
                          : "--"
                        : ""}
                    </a>
                    关注
                  </div>
                  <div className={styles["card-user-stats-item"]}>
                    <a href="../usercenter/myfans" target="_blank">
                      {myInfo
                        ? showCardUser
                          ? getCountString(myInfo.fanCount)
                          : "--"
                        : ""}
                    </a>
                    粉丝
                  </div>
                  <div className={styles["card-user-stats-item"]}>
                    <a
                      href="../usercenter/myposts/ishot/1/1"
                      target="_blank"
                    >
                      {myInfo
                        ? showCardUser
                          ? getCountString(myInfo.receivedLikeCount)
                          : "--"
                        : ""}
                    </a>
                    获赞
                  </div>
                </div>
              </div>

              <div className={styles["card-board"]}>
                <div className={styles["card-board-title"]}>
                  版面列表
                </div>
                <NewTopicsBoardSidebar />
              </div>
            </div>
          </div>
          <div className={styles["card-topic-area-middle"]}>
            {viewMode === UserTopicViewMode.CardMediaOnly
              ? data.map(renderMediaOnlyTopic)
              : data.map(renderCardTopic)}
          </div>
          <div className={styles["card-topic-area-right"]}>
            <div className={styles["card-user-may-mising"]}>
              <RandomRecentTopics />
            </div>
          </div>
        </div>

        <div
          className={`${styles["focus-topic-loading"]}${
            isLoadDone ? ` ${styles.displayNone}` : ""
          }`}
          id="focus-topic-loading"
        >
          <Spin size="large" />
        </div>
        <div
          className={`${styles["focus-topic-loaddone"]}${
            isLoadDone ? "" : ` ${styles.displayNone}`
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
          <div className={styles["top-button-text"]}>回到顶部</div>
        </button>
    </CollectionPageShell>
  );
}
