import * as React from "react";
import { useParams } from "react-router";

import { UserAreaLoading } from "@application/layouts/user-area";
import { useAppSelector } from "@application/store";
import { getCurrentUserFans } from "@modules/follow/api/service";
import { UserFollowCard } from "@modules/follow/ui/UserFollowCard";
import { selectCurrentUser } from "@modules/session/model/selectors";
import type { UserInfo } from "@modules/user/model/dto";
import { parseUserCenterPage } from "@application/routes/user-center/model/route-params";
import { UserCenterPager as Pager } from "@application/routes/user-center/pagination";
import activityStyles from "./MyFans.module.scss";

type RouteParams = {
  page?: string;
};

//用户中心我的粉丝组件
export function MyFans() {
  const { page } = useParams<RouteParams>();
  const currentPage = parseUserCenterPage(page);
  const currentUser = useAppSelector(selectCurrentUser);
  const [userFans, setUserFans] = React.useState<UserInfo[]>([]);
  const userFansRef = React.useRef<UserInfo[]>([]);
  const [totalPage, setTotalPage] = React.useState(() =>
    Math.ceil(currentUser.fanCount / 10),
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setErrorMessage] = React.useState("");

  const loadUserFans = async (nextPage: number) => {
    setIsLoading(true);
    setErrorMessage("");

    // 没有粉丝
    if (currentUser.fanCount === 0) {
      setIsLoading(false);
      return;
    }

    const currentFans = userFansRef.current;
    // 如果未请求完所有帖子并且帖子总数小于请求的页数
    // 换言之，当用户向后翻页，或直接通过url定位页数时
    let shouldLoad = currentFans.length < (nextPage - 1) * 10 + 1;
    // 当用户向前翻页，且之前的页数中存在未加载过的项
    if (!shouldLoad) {
      for (
        let index = (nextPage - 1) * 10;
        index < Math.min(nextPage * 10, currentFans.length);
        index++
      ) {
        if (!currentFans[index]) {
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
      const fanData = await getCurrentUserFans(nextPage);
      // 当请求到空数组时，必然是因为用户通过url访问到了越界的长度
      if (fanData.length === 0) {
        userFansRef.current = [];
        setUserFans([]);
        setTotalPage(0);
        setIsLoading(false);
        return;
      }

      const nextFans = currentFans.slice();
      fanData.forEach((item, index) => {
        nextFans[index + (nextPage - 1) * 10] = item;
      });
      userFansRef.current = nextFans;
      setUserFans(nextFans);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const changeFollowingState = (userId: number, isFollowing: boolean) => {
    const nextFans = userFansRef.current.map((item) =>
      item.id === userId ? { ...item, isFollowing } : item,
    );
    userFansRef.current = nextFans;
    setUserFans(nextFans);
  };

  React.useEffect(() => {
    void loadUserFans(currentPage);
  }, [currentPage]);

  React.useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage]);

  if (isLoading) {
    return <UserAreaLoading />;
  } else if (userFans.length === 0) {
    return (
      <div className={activityStyles["user-center-myfans"]} style={{ textAlign: "center" }}>
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
    <div className={activityStyles["user-center-myfans"]}>
      <div className={activityStyles["user-center-myfans-exact"]}>{fanItems}</div>
      <Pager
        currentPage={currentPage}
        totalPage={totalPage}
        href="/usercenter/myfans/"
        hasTotal={true}
      />
    </div>
  );
}
