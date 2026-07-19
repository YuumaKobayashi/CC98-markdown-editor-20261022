// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "@app/store";
import * as Actions from "@legacy/Actions/UserCenter";
import { getRecentPosts } from "@legacy/AsyncActions/UserCenter";
import Post from "@legacy/Components/UserCenter/ExactActivitiesPost";
import Pager from "@legacy/Components/UserCenter/Pager";
import type { UserRecentPost } from "@legacy/States/AppState";
import {
  parseUserCenterIsHot,
  parseUserCenterPage,
} from "@pages/user-center/model/route-params";

type RouteParams = {
  page?: string;
  ishot?: string;
};

/**
 * 用户中心我的主题组件
 */
export function MyPosts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { page, ishot } = useParams<RouteParams>();
  const currentPage = parseUserCenterPage(page);
  const isHot = parseUserCenterIsHot(ishot);
  const userRecentPosts = useAppSelector(
    (state) => state.userInfo.recentPosts
  );
  const totalPage = useAppSelector(
    (state) => state.userInfo.totalPage.myposts
  );
  const hasTotal = useAppSelector(
    (state) => state.userInfo.hasTotal.myposts
  );
  const isLoading = useAppSelector((state) => state.userInfo.isLoading);

  React.useEffect(() => {
    dispatch(Actions.changeUserCenterPage("myposts"));
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(getRecentPosts(currentPage, isHot));
  }, [currentPage, dispatch, isHot]);

  React.useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage, isHot]);

  const changeIsHot = (nextIsHot: 0 | 1) => {
    void navigate(`/usercenter/myposts/ishot/${nextIsHot}/1`);
  };

  if (isLoading) {
    return (
      <div className="user-center-loading">
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
      </div>
    );
  } else if (userRecentPosts.length === 0) {
    return (
      <div className="user-posts" style={{ textAlign: "center" }}>
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
    <div className="user-posts">
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
