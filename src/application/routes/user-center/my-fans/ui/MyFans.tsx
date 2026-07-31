import * as React from "react";
import { useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "@application/store";
import { UserFollowCard } from "@modules/follow";
import * as Actions from "@legacy/Actions/UserCenter";
import { getUserFansInfo } from "@legacy/AsyncActions/UserCenter";
import type { UserInfo } from "@legacy/States/AppState";
import { parseUserCenterPage } from "@application/routes/user-center/model/route-params";
import { UserCenterPager as Pager } from "@application/routes/user-center/pagination";

type RouteParams = {
  page?: string;
};

//用户中心我的粉丝组件
export function MyFans() {
  const dispatch = useAppDispatch();
  const { page } = useParams<RouteParams>();
  const currentPage = parseUserCenterPage(page);
  const userFans = useAppSelector((state) => state.userInfo.currentUserFansInfo);
  const totalPage = useAppSelector((state) => state.userInfo.totalPage.myfans);
  const isLoading = useAppSelector((state) => state.userInfo.isLoading);

  React.useEffect(() => {
    dispatch(Actions.changeUserCenterPage("myfans"));
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(getUserFansInfo(currentPage));
  }, [currentPage, dispatch]);

  React.useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage]);

  const changeFollowingState = (userId: number, isFollowing: boolean) => {
    dispatch(
      isFollowing ? Actions.followUser(userId) : Actions.unfollowUser(userId),
    );
  };

  if (isLoading) {
    return (
      <div className="user-center-loading">
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
      </div>
    );
  } else if (userFans.length === 0) {
    return (
      <div className="user-center-myfans" style={{ textAlign: "center" }}>
        没有粉丝
      </div>
    );
  }

  //state转换为JSX
  const fanItems = userFans
    .slice((currentPage - 1) * 10, currentPage * 10)
    .map((item: UserInfo) => (
      <UserFollowCard
        key={item.id}
        user={item}
        onFollowingChange={changeFollowingState}
      />
    ));
  //添加分隔线
  for (let index = 1; index < fanItems.length; index += 2) {
    fanItems.splice(index, 0, <hr key={index} />);
  }

  return (
    <div className="user-center-myfans">
      <div className="user-center-myfans-exact">{fanItems}</div>
      <Pager
        currentPage={currentPage}
        totalPage={totalPage}
        href="/usercenter/myfans/"
        hasTotal={true}
      />
    </div>
  );
}
