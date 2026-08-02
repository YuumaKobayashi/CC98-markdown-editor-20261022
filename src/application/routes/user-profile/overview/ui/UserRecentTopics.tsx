import * as React from "react";

import {
  UserActivityList,
  UserActivitySection,
} from "@application/layouts/user-area";
import { UserRecentTopicItem as Topic } from "@modules/topic";
import { getToken } from "@modules/session";
import type { UserRecentTopic } from "@modules/topic";
import { cc98Fetch } from "@foundation/api/http";
import styles from "./UserRecentTopics.module.scss";

interface UserRecentTopicsProps {
  id: number;
}

//TODO: 请求逻辑需要拆一下 后续重构吧

/**
 * 用户详情页
 * 用户最近所发主题组件
 */
export function UserRecentTopics({ id }: UserRecentTopicsProps) {
  const [topics, setTopics] = React.useState<UserRecentTopic[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const requestIdRef = React.useRef(0);
  const loadingRef = React.useRef(false);

  const requestTopics = React.useCallback(
    async (offset: number, replace: boolean, showLoading: boolean) => {
      const currentRequestId = ++requestIdRef.current;
      if (showLoading) {
        loadingRef.current = true;
        setIsLoading(true);
      }

      try {
        const token = await getToken();
        const headers = new Headers();
        headers.append("Authorization", token);
        const response = await cc98Fetch(
          `/user/${id}/recent-topic?userid=${id}&from=${offset}&size=11`,
          { headers }
        );
        if (response.status !== 200) throw new Error();

        const result = (await response.json()) as UserRecentTopic[];
        if (currentRequestId !== requestIdRef.current) return;

        const visibleTopics = result.slice(0, result.length === 11 ? 10 : result.length);
        setTopics((previousTopics) =>
          replace ? visibleTopics : previousTopics.concat(visibleTopics)
        );
        setHasMore(result.length === 11);
      } catch {
        if (currentRequestId === requestIdRef.current) {
          console.log(
            replace ? "用户中心帖子加载失败" : "用户中心滚动加载失败"
          );
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          loadingRef.current = false;
          setIsLoading(false);
        }
      }
    },
    [id]
  );

  React.useEffect(() => {
    ++requestIdRef.current;
    setTopics([]);
    loadingRef.current = false;
    setIsLoading(false);
    setHasMore(true);
    void requestTopics(0, true, false);

    return () => {
      ++requestIdRef.current;
    };
  }, [id, requestTopics]);

  React.useEffect(() => {
    if (!hasMore) return;

    /**
     * 当用户滚动时
     * 判断滚动条位置
     * 按需加载新帖
     */
    const scrollHandler = () => {
      const pageYLeft = document.body.scrollHeight - window.pageYOffset;
      if (pageYLeft < 1500 && !loadingRef.current) {
        void requestTopics(topics.length, false, true);
      }
    };

    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [hasMore, isLoading, requestTopics, topics.length]);

  if (topics.length === 0) {
    const style = {
      marginLeft: "2rem",
    };

    return (
      <UserActivitySection title="发表的主题">
        <div className={styles["user-posts"]} style={style}>
          没有主题
        </div>
      </UserActivitySection>
    );
  }

  return (
    <UserActivitySection title="发表的主题">
      <UserActivityList>
        {topics.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 ? <hr /> : null}
            <Topic userRecentTopic={item} />
          </React.Fragment>
        ))}
      </UserActivityList>
    </UserActivitySection>
  );
}
