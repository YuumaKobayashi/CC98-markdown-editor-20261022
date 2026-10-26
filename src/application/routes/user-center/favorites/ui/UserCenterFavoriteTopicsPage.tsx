// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { SearchInput } from "@foundation/ui/input";
import { Select } from "@foundation/ui/select";
import { useLocation, useNavigate, useParams } from "react-router";

import {
  UserActivityList,
  UserAreaLoading,
} from "@application/layouts/user-area";
import {
  getCurrentUserFavoriteTopics,
  getFavoriteAllTopic,
} from "@modules/favorite-topic/api/service";
import {
  defaultFavoriteTopicGroups,
  FavoriteTopicOrder,
  type FavoriteTopicGroup,
} from "@modules/favorite-topic/model/favorite-topic-group";
import type { UserRecentTopic } from "@modules/topic/model/view-model";
import { UserCenterPager as Pager } from "@application/routes/user-center/pagination";

import { FavoriteTopicGroupManager } from "./FavoriteTopicGroupManager";
import { UserCenterFavoriteTopicItem as Topic } from "./UserCenterFavoriteTopicItem";
import activityStyles from "./UserCenterFavoriteTopicsPage.module.scss";

type RouteParams = {
  page?: string;
  order?: string;
  group?: string;
};

const defaultGroup = 0;

const favoriteTopicOrderOptions = [
  { value: FavoriteTopicOrder.PostTime, label: "按发帖时间排序" },
  { value: FavoriteTopicOrder.LastReply, label: "按最后回复排序" },
  { value: FavoriteTopicOrder.FavorTime, label: "按收藏顺序排序" },
];

const parseSearch = (search: string) => {
  const result: Record<string, string> = {};
  const queryString = search.replace("?", "");
  const keyValues = queryString.split("&");
  for (const keyValue of keyValues) {
    const [key, value] = keyValue.split("=");
    result[key] = decodeURI(value);
  }
  return result;
};

const getKeyword = (search: string) => {
  if (!search) return "";
  const data = parseSearch(search);
  return data.keyword || "";
};

/**
 * 用户中心我收藏的帖子组件
 */
export function UserCenterFavoriteTopicsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    page,
    order: orderParam,
    group: groupParam,
  } = useParams<RouteParams>();
  const requestPage = Number(page || "1");
  const currentPage = parseInt(page ?? "") || 1;
  const order = Number(orderParam) as FavoriteTopicOrder;
  const group = Number(groupParam || "0");
  const keywordRef = React.useRef("");
  const routeRef = React.useRef({ currentPage, group, order });
  routeRef.current = { currentPage, group, order };

  const [currentUserFavoriteTopics, setCurrentUserFavoriteTopics] =
    React.useState<UserRecentTopic[]>([]);
  const [totalPage, setTotalPage] = React.useState(1);
  const [hasTotal, setHasTotal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setErrorMessage] = React.useState("");
  const [favoriteTopicList, setFavoriteTopicList] = React.useState<
    FavoriteTopicGroup[]
  >(defaultFavoriteTopicGroups);

  const loadFavoriteTopics = async (
    nextPage: number,
    nextOrder: FavoriteTopicOrder,
    nextGroup: number,
    keyword: string,
  ) => {
    console.log(
      "getFavoritePosts",
      nextPage,
      nextOrder,
      nextGroup,
      true,
      keyword,
    );
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await getCurrentUserFavoriteTopics(
        nextPage,
        nextOrder,
        nextGroup,
        keyword,
      );
      setCurrentUserFavoriteTopics(result.topics);
      setHasTotal(true);
      setTotalPage(result.totalPage);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  const updateFavoriteTopicList = async () => {
    try {
      const favoriteTopicListResponse = await getFavoriteAllTopic();
      console.log(favoriteTopicListResponse);
      setFavoriteTopicList(
        favoriteTopicListResponse.errorCode === 0
          ? (favoriteTopicListResponse.data ?? defaultFavoriteTopicGroups)
          : defaultFavoriteTopicGroups,
      );
    } catch (error) {
      setFavoriteTopicList(defaultFavoriteTopicGroups);
      console.log(error);
    }

    const currentRoute = routeRef.current;
    void navigate(
      `/usercenter/myfavorites/order/${currentRoute.order}/group/${currentRoute.group}/${currentRoute.currentPage}`,
    );
  };

  React.useEffect(() => {
    const keyword = getKeyword(location.search);
    // 手动输入企图搜索且排序时重定向
    if (order !== FavoriteTopicOrder.LastReply && keyword !== "") {
      void navigate(
        `/usercenter/myfavorites/order/0/group/0/1?keyword=${keyword}`,
        { replace: true },
      );
    }
    keywordRef.current = keyword;
    void updateFavoriteTopicList();
    // favoriteTopicList.ok && this.setState({ favoriteTopicList: favoriteTopicList.body });
    // console.log(favoriteTopicList.json());
    console.log("componentDidMount");
  }, []);

  React.useEffect(() => {
    const keyword = getKeyword(location.search);
    keywordRef.current = keyword;
    void loadFavoriteTopics(requestPage, order, group, keyword);
    window.scroll(0, 0);
  }, [group, location.search, order, requestPage]);

  const changeGroupAndOrderAndKeyword = (
    nextGroup: number,
    nextOrder: FavoriteTopicOrder,
    keyword = "",
  ) => {
    console.log("Change", nextGroup, nextOrder, keyword);
    setHasTotal(false);
    if (keyword) {
      void navigate(
        `/usercenter/myfavorites/order/0/group/0/1?keyword=${keyword}`,
      );
    } else {
      keywordRef.current = "";
      console.log("changeGroupAndOrderAndKeyword");
      void navigate(
        `/usercenter/myfavorites/order/${nextOrder}/group/${nextGroup}/1`,
      );
    }
  };

  const handleSearch = (keyword: string) => {
    keywordRef.current = keyword;
    changeGroupAndOrderAndKeyword(defaultGroup, order, keyword);
  };

  const handleTopicUpdate = () => {
    void updateFavoriteTopicList();
    void loadFavoriteTopics(currentPage, order, group, keywordRef.current);
  };

  if (isLoading) {
    return <UserAreaLoading />;
  }

  const emptyPage = (
    <div className={activityStyles["user-posts"]}>没有主题</div>
  );
  console.log(totalPage);
  const displayedTotalPage = hasTotal ? totalPage : currentPage + 1;
  //state转换为JSX
  const userRecentPosts = currentUserFavoriteTopics.map(
    (item: UserRecentTopic) => (
      <Topic
        key={item.id}
        userRecentTopic={item}
        updateinfo={handleTopicUpdate}
      />
    ),
  );
  //添加分隔线
  for (let i = 1; i < userRecentPosts.length; i += 2) {
    userRecentPosts.splice(i, 0, <hr key={i} />);
  }
  // const curPageNum = parseInt(this.props.match.params.page) || 1;

  console.log(favoriteTopicList);
  const groupOptions = favoriteTopicList.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.count})`,
  }));

  return (
    <UserActivityList>
      <div className={activityStyles["user-post-operator"]}>
        <Select
          value={group}
          className={activityStyles.favoriteSelect}
          classNames={{
            trigger: activityStyles.selectTrigger,
            positioner: activityStyles.selectPositioner,
            popup: activityStyles.selectPopup,
            item: activityStyles.selectItem,
          }}
          ariaLabel="收藏分组筛选"
          options={groupOptions}
          onValueChange={(value) => {
            if (value !== null) {
              changeGroupAndOrderAndKeyword(value, order);
            }
          }}
        />
        <Select
          value={order}
          className={activityStyles.favoriteSelect}
          classNames={{
            trigger: activityStyles.selectTrigger,
            positioner: activityStyles.selectPositioner,
            popup: activityStyles.selectPopup,
            item: activityStyles.selectItem,
          }}
          ariaLabel="收藏主题排序方式"
          options={favoriteTopicOrderOptions}
          onValueChange={(value) => {
            if (value !== null) {
              changeGroupAndOrderAndKeyword(group, value);
            }
          }}
        />
        <SearchInput
          className={activityStyles.favoriteSearch}
          defaultValue={keywordRef.current}
          placeholder="输入关键词"
          onSearch={handleSearch}
          searchLabel="搜 索"
        />
        <div className={activityStyles["user-post-operator-tips"]}>
          收藏搜索目前只能按照最后回复排序
        </div>
        <FavoriteTopicGroupManager
          updateFavoriteTopicList={updateFavoriteTopicList}
          favoriteTopicList={favoriteTopicList}
        />
        <br />
      </div>
      {/* <Button
        onClick={() => {
          //use history to refresh
          this.props.changePage();
          // this.props.history.push(
            // `/usercenter/myfavorites/order/${order}/group/${group}/${curPage}`
          // );
        }}
      >测试</Button> */}
      <hr />
      {currentUserFavoriteTopics.length === 0 ? (
        emptyPage
      ) : (
        <>
          {userRecentPosts}
          <br />
          <Pager
            currentPage={currentPage}
            totalPage={displayedTotalPage}
            href={`/usercenter/myfavorites/order/${order}/group/${group}/`}
            hasTotal={hasTotal}
            keyword={keywordRef.current}
          />
        </>
      )}
    </UserActivityList>
  );
}

export default UserCenterFavoriteTopicsPage;
