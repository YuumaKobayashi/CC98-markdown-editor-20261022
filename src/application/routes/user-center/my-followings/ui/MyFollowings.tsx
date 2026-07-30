import * as React from "react";
import { useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "@application/store";
import { UserFollowCard } from "@modules/follow";
import * as Actions from "@legacy/Actions/UserCenter";
import { getUserFollowingsInfo } from "@legacy/AsyncActions/UserCenter";
import type { UserInfo } from "@legacy/States/AppState";
import { parseUserCenterPage } from "@application/routes/user-center/model/route-params";
import { UserCenterPager as Pager } from "@application/routes/user-center/pagination";

type RouteParams = {
  page?: string;
};

//用户中心我的关注组件
export function MyFollowings() {
  const dispatch = useAppDispatch();
  const { page } = useParams<RouteParams>();
  const currentPage = parseUserCenterPage(page);
  const userFollowings = useAppSelector(
    (state) => state.userInfo.currentUserFollowingInfo,
  );
  const totalPage = useAppSelector(
    (state) => state.userInfo.totalPage.myfollowings,
  );
  const isLoading = useAppSelector((state) => state.userInfo.isLoading);

  React.useEffect(() => {
    dispatch(getUserFollowingsInfo(currentPage));
  }, [currentPage, dispatch]);

  React.useEffect(() => {
    dispatch(Actions.changeUserCenterPage("myfollowings"));
  }, [dispatch]);

  React.useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="user-center-loading">
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
      </div>
    );
  } else if (userFollowings.length === 0) {
    return (
      <div className="user-center-myfans" style={{ textAlign: "center" }}>
        没有关注
      </div>
    );
  }

  //state转换为JSX
  const followingItems = userFollowings
    .slice((currentPage - 1) * 10, currentPage * 10)
    .map((item: UserInfo) => (
      <UserFollowCard key={item.id} user={item} />
    ));
  //添加分隔线
  for (let index = 1; index < followingItems.length; index += 2) {
    followingItems.splice(index, 0, <hr key={index} />);
  }

  return (
    <div className="user-center-myfans">
      <div className="user-center-myfans-exact">{followingItems}</div>
      <Pager
        currentPage={currentPage}
        totalPage={totalPage}
        href="/usercenter/myfollowings/"
        hasTotal={true}
      />
    </div>
  );
}
