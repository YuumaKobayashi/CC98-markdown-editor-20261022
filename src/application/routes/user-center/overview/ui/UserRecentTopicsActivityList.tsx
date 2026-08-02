// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";

import {
  UserActivityList,
  UserAreaLoading,
} from "@application/layouts/user-area";
import {
  getCurrentUserRecentTopics,
  UserRecentTopicItem as Topic,
} from "@modules/topic";
import type { UserRecentTopic } from "@legacy/States/AppState";
import activityStyles from "../../../../layouts/user-area/UserActivityLayout.module.scss";

//用户中心主页帖子动态组件
export function UserRecentTopicsActivityList() {
  const [userRecentTopics, setUserRecentTopics] = React.useState<
    UserRecentTopic[]
  >([]);
  const [hasTotal, setHasTotal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setErrorMessage] = React.useState("");
  /**
   * 滚动没有分页信息，用自定义页数替代
   */
  const nextPageRef = React.useRef(1);
  const isLoadingRef = React.useRef(isLoading);
  isLoadingRef.current = isLoading;
  const shouldLoad = !hasTotal;

  const loadPage = React.useCallback(async (page: number) => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await getCurrentUserRecentTopics(page);
      setUserRecentTopics((currentTopics) => {
        const nextTopics = [...currentTopics];
        const pageStart = (page - 1) * 10;
        result.topics.forEach((topic, index) => {
          nextTopics[pageStart + index] = topic;
        });
        return nextTopics;
      });
      if (!result.hasMore) {
        setHasTotal(true);
      }
      isLoadingRef.current = false;
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  }, []);

  React.useEffect(() => {
    /**
     * 每次读取页数时给page加一
     */
    void loadPage(nextPageRef.current++);
  }, [loadPage]);

  React.useEffect(() => {
    if (!shouldLoad) return;

    const scrollHandler = () => {
      const pageYLeft = document.body.scrollHeight - window.pageYOffset;

      if (pageYLeft < 1500 && isLoadingRef.current === false) {
        void loadPage(nextPageRef.current++);
      }
    };

    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [loadPage, shouldLoad]);

  if (userRecentTopics.length === 0 && hasTotal) {
    return (
      <div className={activityStyles["user-posts"]} style={{ marginLeft: "2rem" }}>
        没有主题
      </div>
    );
  }

  //state转换为JSX
  const topicItems = userRecentTopics.map((item: UserRecentTopic) => (
    <Topic key={item.id} userRecentTopic={item} />
  ));
  //添加分隔线
  for (let i = 1; i < topicItems.length; i += 2) {
    topicItems.splice(i, 0, <hr key={i} />);
  }

  return (
    <UserActivityList>
      {topicItems}
      {isLoading ? <UserAreaLoading /> : null}
    </UserActivityList>
  );
}

export default UserRecentTopicsActivityList;
