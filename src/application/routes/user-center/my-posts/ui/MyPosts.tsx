// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router";

import {
  getCurrentUserRecentPosts,
  UserRecentPostItem as Post,
} from "@modules/post";
import type { UserRecentPost } from "@legacy/States/AppState";
import {
  parseUserCenterIsHot,
  parseUserCenterPage,
} from "@application/routes/user-center/model/route-params";
import { UserCenterPager as Pager } from "@application/routes/user-center/pagination";
import styles from "../../UserCenter.module.scss";

type RouteParams = {
  page?: string;
  ishot?: string;
};

/**
 * 用户中心我的主题组件
 */
export function MyPosts() {
  const navigate = useNavigate();
  const { page, ishot } = useParams<RouteParams>();
  const currentPage = parseUserCenterPage(page);
  const isHot = parseUserCenterIsHot(ishot);
  const [userRecentPosts, setUserRecentPosts] = React.useState<
    UserRecentPost[]
  >([]);
  const [totalPage, setTotalPage] = React.useState(1);
  const [hasTotal, setHasTotal] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    const loadPage = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getCurrentUserRecentPosts(currentPage, isHot);
        setUserRecentPosts((currentPosts) => {
          const nextPosts = [...currentPosts];
          const pageStart = (currentPage - 1) * 10;
          result.posts.forEach((post, index) => {
            nextPosts[pageStart + index] = post;
          });
          return nextPosts;
        });
        setTotalPage(result.totalPage);
        if (!result.hasMore) {
          setHasTotal(true);
        }
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : String(error));
      }
    };

    void loadPage();
  }, [currentPage, isHot]);

  React.useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage, isHot]);

  const changeIsHot = (nextIsHot: 0 | 1) => {
    void navigate(`/usercenter/myposts/ishot/${nextIsHot}/1`);
  };

  if (isLoading) {
    return (
      <div className={styles["user-center-loading"]}>
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
      </div>
    );
  } else if (userRecentPosts.length === 0) {
    return (
      <div className={styles["user-posts"]} style={{ textAlign: "center" }}>
        没有回复
      </div>
    );
  }

  const displayedTotalPage = hasTotal ? totalPage : currentPage + 1;
  //state转换为JSX
  const postItems = userRecentPosts
    .slice((currentPage - 1) * 10, currentPage * 10)
    .map((item: UserRecentPost) => (
      <Post key={item.id} userRecentPost={item} />
    ));
  //添加分隔线
  for (let i = 1; i < postItems.length; i += 2) {
    postItems.splice(i, 0, <hr key={i} />);
  }

  return (
    <div className={styles["user-posts"]}>
      {isHot === 0 ? (
        <Button
          style={{ width: "8rem", marginTop: "-1rem", marginBottom: "2rem" }}
          className="user-ishot-btn"
          type="primary"
          onClick={() => changeIsHot(1)}
        >
          显示热门回复
        </Button>
      ) : (
        <Button
          style={{ width: "8rem", marginTop: "-1rem", marginBottom: "2rem" }}
          type="primary"
          onClick={() => changeIsHot(0)}
        >
          显示全部回复
        </Button>
      )}
      {postItems}
      <Pager
        currentPage={currentPage}
        totalPage={displayedTotalPage}
        href={`/usercenter/myposts/ishot/${isHot}/`}
        hasTotal={hasTotal}
      />
    </div>
  );
}

export default MyPosts;
