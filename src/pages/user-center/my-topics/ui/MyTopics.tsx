// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "@app/store";
import { UserRecentTopicItem as Topic } from "@entities/topic";
import * as Actions from "@legacy/Actions/UserCenter";
import { getRecentTopics } from "@legacy/AsyncActions/UserCenter";
import type { UserRecentTopic } from "@legacy/States/AppState";
import { parseUserCenterPage } from "@pages/user-center/model/route-params";
import { UserCenterPager as Pager } from "@pages/user-center/pagination";

type RouteParams = {
  page?: string;
};

/**
 * 用户中心我的主题组件
 */
export function MyTopics() {
  const dispatch = useAppDispatch();
  const { page } = useParams<RouteParams>();
  const currentPage = parseUserCenterPage(page);
  const userRecentTopics = useAppSelector(
    (state) => state.userInfo.recentTopics
  );
  const totalPage = useAppSelector(
    (state) => state.userInfo.totalPage.mytopics
  );
  const hasTotal = useAppSelector(
    (state) => state.userInfo.hasTotal.mytopics
  );
  const isLoading = useAppSelector((state) => state.userInfo.isLoading);

  React.useEffect(() => {
    dispatch(Actions.changeUserCenterPage("mytopics"));
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(getRecentTopics(currentPage));
  }, [currentPage, dispatch]);

  React.useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="user-center-loading">
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
      </div>
    );
  } else if (userRecentTopics.length === 0) {
    return (
      <div className="user-posts" style={{ textAlign: "center" }}>
        没有主题
      </div>
    );
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
    <div className="user-posts">
      {topicItems}
      <Pager
        currentPage={currentPage}
        totalPage={displayedTotalPage}
        href="/usercenter/mytopics/"
        hasTotal={hasTotal}
      />
    </div>
  );
}

export default MyTopics;
