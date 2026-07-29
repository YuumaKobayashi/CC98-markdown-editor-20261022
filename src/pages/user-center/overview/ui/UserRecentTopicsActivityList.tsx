// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import { UserRecentTopicItem as Topic } from "@entities/topic";
import * as Actions from "@legacy/Actions/UserCenter";
import { getRecentTopics } from "@legacy/AsyncActions/UserCenter";
import type { UserRecentTopic } from "@legacy/States/AppState";

//用户中心主页帖子动态组件
export function UserRecentTopicsActivityList() {
  const dispatch = useAppDispatch();
  const userRecentTopics = useAppSelector(
    (state) => state.userInfo.recentTopics
  );
  const hasTotal = useAppSelector(
    (state) => state.userInfo.hasTotal.mytopics
  );
  const isLoading = useAppSelector((state) => state.userInfo.isLoading);
  /**
   * 滚动没有分页信息，用自定义页数替代
   */
  const nextPageRef = React.useRef(1);
  const isLoadingRef = React.useRef(isLoading);
  isLoadingRef.current = isLoading;
  let hasInvalidTopic = false;
  for (let i = 0; i < userRecentTopics.length; i++) {
    if (!userRecentTopics[i]) {
      hasInvalidTopic = true;
      break;
    }
  }
  const shouldLoad = !hasTotal || hasInvalidTopic;

  React.useEffect(() => {
    let shouldLoadInitialPage = !hasTotal;
    for (let i = 0; i < userRecentTopics.length; i++) {
      if (!userRecentTopics[i]) {
        dispatch(Actions.changeUserRecentTopics([]));
        dispatch(Actions.usercenterPageLoadUnfinish());
        shouldLoadInitialPage = true;
        break;
      }
    }
    if (shouldLoadInitialPage) {
      /**
       * 每次读取页数时给page加一
       */
      dispatch(getRecentTopics(nextPageRef.current++));
    }
  }, []);

  React.useEffect(() => {
    if (!shouldLoad) return;

    const scrollHandler = () => {
      const pageYLeft = document.body.scrollHeight - window.pageYOffset;

      if (pageYLeft < 1500 && isLoadingRef.current === false) {
        dispatch(getRecentTopics(nextPageRef.current++));
      }
    };

    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [dispatch, shouldLoad]);

  if (userRecentTopics.length === 0 && hasTotal) {
    return (
      <div className="user-posts" style={{ marginLeft: "2rem" }}>
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
    <div className="user-posts">
      {topicItems}
      {isLoading ? (
        <div className="user-center-loading">
          <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
        </div>
      ) : null}
    </div>
  );
}

export default UserRecentTopicsActivityList;
