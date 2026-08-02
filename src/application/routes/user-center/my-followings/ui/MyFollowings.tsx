import * as React from "react";
import { useParams } from "react-router";

import { UserAreaLoading } from "@application/layouts/user-area";
import { useAppSelector } from "@application/store";
import {
  getCurrentUserFollowings,
  UserFollowCard,
} from "@modules/follow";
import { selectCurrentUser } from "@modules/session";
import type { UserInfo } from "@modules/user";
import { parseUserCenterPage } from "@application/routes/user-center/model/route-params";
import { UserCenterPager as Pager } from "@application/routes/user-center/pagination";
import activityStyles from "./MyFollowings.module.scss";

type RouteParams = {
  page?: string;
};

//用户中心我的关注组件
export function MyFollowings() {
  const { page } = useParams<RouteParams>();
  const currentPage = parseUserCenterPage(page);
  const currentUser = useAppSelector(selectCurrentUser);
  const [userFollowings, setUserFollowings] = React.useState<UserInfo[]>([]);
  const userFollowingsRef = React.useRef<UserInfo[]>([]);
  const [totalPage, setTotalPage] = React.useState(() =>
    Math.ceil(currentUser.followCount / 10),
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setErrorMessage] = React.useState("");

  const loadUserFollowings = async (nextPage: number) => {
    setIsLoading(true);
    setErrorMessage("");

    // 没有关注
    if (currentUser.followCount === 0) {
      setIsLoading(false);
      return;
    }

    const currentFollowings = userFollowingsRef.current;
    // 如果未请求完所有帖子并且帖子总数小于请求的页数
    // 换言之，当用户向后翻页，或直接通过url定位页数时
    let shouldLoad =
      currentFollowings.length < (nextPage - 1) * 10 + 1;
    // 当用户向前翻页，且之前的页数中存在未加载过的项
    if (!shouldLoad) {
      for (
        let index = (nextPage - 1) * 10;
        index < Math.min(nextPage * 10, currentFollowings.length);
        index++
      ) {
        if (!currentFollowings[index]) {
          shouldLoad = true;
          break;
        }
      }
    }

    if (!shouldLoad) {
      setIsLoading(false);
      return;
    }

    try {
      const followData = await getCurrentUserFollowings(nextPage);
      // 当请求到空数组时，必然是因为用户通过url访问到了越界的长度
      if (followData.length === 0) {
        userFollowingsRef.current = [];
        setUserFollowings([]);
        setTotalPage(0);
        setIsLoading(false);
        return;
      }

      const nextFollowings = currentFollowings.slice();
      followData.forEach((item, index) => {
        nextFollowings[index + (nextPage - 1) * 10] = item;
      });
      userFollowingsRef.current = nextFollowings;
      setUserFollowings(nextFollowings);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const changeFollowingState = (userId: number, isFollowing: boolean) => {
    const nextFollowings = userFollowingsRef.current.map((item) =>
      item.id === userId ? { ...item, isFollowing } : item,
    );
    userFollowingsRef.current = nextFollowings;
    setUserFollowings(nextFollowings);
  };

  React.useEffect(() => {
    void loadUserFollowings(currentPage);
  }, [currentPage]);

  React.useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage]);

  if (isLoading) {
    return <UserAreaLoading />;
  } else if (userFollowings.length === 0) {
    return (
      <div className={activityStyles["user-center-myfans"]} style={{ textAlign: "center" }}>
        没有关注
      </div>
    );
  }

  //state转换为JSX
  const followingItems = userFollowings
    .slice((currentPage - 1) * 10, currentPage * 10)
    .map((item: UserInfo) => (
      <UserFollowCard
        key={item.id}
        user={item}
        onFollowingChange={changeFollowingState}
      />
    ));
  //添加分隔线
  for (let index = 1; index < followingItems.length; index += 2) {
    followingItems.splice(index, 0, <hr key={index} />);
  }

  return (
    <div className={activityStyles["user-center-myfans"]}>
      <div className={activityStyles["user-center-myfans-exact"]}>{followingItems}</div>
      <Pager
        currentPage={currentPage}
        totalPage={totalPage}
        href="/usercenter/myfollowings/"
        hasTotal={true}
      />
    </div>
  );
}
