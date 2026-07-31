// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import {
  getCurrentUserRecentPosts,
  UserRecentPostItem as Post,
} from "@modules/post";
import type { UserRecentPost } from "../../States/AppState";

//用户中心主页帖子动态组件
function ExactActivitiesPosts() {
  const [userRecentPosts, setUserRecentPosts] = React.useState<
    UserRecentPost[]
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

  const loadPage = React.useCallback(async (page: number) => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setErrorMessage("");

    try {
      // 原组件调用旧 thunk 时未传 ishot，实际请求 hot-post。
      const result = await getCurrentUserRecentPosts(page, 1);
      setUserRecentPosts((currentPosts) => {
        const nextPosts = [...currentPosts];
        const pageStart = (page - 1) * 10;
        result.posts.forEach((post, index) => {
          nextPosts[pageStart + index] = post;
        });
        return nextPosts;
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
    if (hasTotal) {
      return;
    }

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
  }, [hasTotal, loadPage]);

  if (userRecentPosts.length === 0 && hasTotal) {
    return (
      <div className="user-posts" style={{ marginLeft: "2rem" }}>
        没有回复
      </div>
    );
  }

  //state转换为JSX
  const postItems = userRecentPosts.map((item) => (
    <Post key={item.id} userRecentPost={item} />
  ));
  //添加分隔线
  for (let i = 1; i < postItems.length; i += 2) {
    postItems.splice(i, 0, <hr key={i} />);
  }

  return (
    <div className="user-posts">
      {postItems}
      {isLoading ? (
        <div className="user-center-loading">
          <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
        </div>
      ) : null}
    </div>
  );
}

export default ExactActivitiesPosts;
