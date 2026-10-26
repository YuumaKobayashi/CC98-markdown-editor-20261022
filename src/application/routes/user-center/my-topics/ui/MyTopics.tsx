// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { useParams } from "react-router";

import {
  UserActivityList,
  UserAreaLoading,
} from "@application/layouts/user-area";
import { getCurrentUserRecentTopics } from "@modules/topic/api/service";
import { UserRecentTopicItem as Topic } from "@modules/topic/ui/UserRecentTopicItem";
import type { UserRecentTopic } from "@modules/topic/model/view-model";
import { parseUserCenterPage } from "@application/routes/user-center/model/route-params";
import { UserCenterPager as Pager } from "@application/routes/user-center/pagination";
import activityStyles from "./MyTopics.module.scss";

type RouteParams = {
  page?: string;
};

/**
 * 用户中心我的主题组件
 */
export function MyTopics() {
  const { page } = useParams<RouteParams>();
  const currentPage = parseUserCenterPage(page);
  const [userRecentTopics, setUserRecentTopics] = React.useState<
    UserRecentTopic[]
  >([]);
  const [totalPage, setTotalPage] = React.useState(1);
  const [hasTotal, setHasTotal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    const pageStart = (currentPage - 1) * 10;
    let shouldLoad =
      userRecentTopics.length < pageStart + 1 &&
      (!hasTotal || currentPage <= totalPage);

    for (
      let index = pageStart;
      index < Math.min(userRecentTopics.length, currentPage * 10);
      index += 1
    ) {
      if (!userRecentTopics[index]) {
        shouldLoad = !hasTotal || currentPage <= totalPage;
        break;
      }
    }

    if (!shouldLoad) {
      return;
    }

    const loadPage = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getCurrentUserRecentTopics(currentPage);
        setUserRecentTopics((currentTopics) => {
          const nextTopics = [...currentTopics];
          result.topics.forEach((topic, index) => {
            nextTopics[pageStart + index] = topic;
          });
          return nextTopics;
        });
        setHasTotal(true);
        setTotalPage(result.totalPage);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : String(error));
      }
    };

    void loadPage();
  }, [currentPage, hasTotal, totalPage, userRecentTopics]);

  React.useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage]);

  if (isLoading) {
    return <UserAreaLoading />;
  } else if (userRecentTopics.length === 0) {
    return <div className={activityStyles["user-posts"]}>没有主题</div>;
  }

  const displayedTotalPage = hasTotal ? totalPage : currentPage + 1;
  //state转换为JSX
  const topicItems = userRecentTopics
    .slice((currentPage - 1) * 10, currentPage * 10)
    .map((item: UserRecentTopic) => (
      <Topic key={item.id} userRecentTopic={item} />
    ));
  //添加分隔线
  for (let i = 1; i < topicItems.length; i += 2) {
    topicItems.splice(i, 0, <hr key={i} />);
  }

  return (
    <UserActivityList>
      {topicItems}
      <Pager
        currentPage={currentPage}
        totalPage={displayedTotalPage}
        href="/usercenter/mytopics/"
        hasTotal={hasTotal}
      />
    </UserActivityList>
  );
}

export default MyTopics;
