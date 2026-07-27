// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Button, Input, Select } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "@app/store";
import {
  defaultFavoriteTopicGroups,
  getFavoriteAllTopic,
  type FavoriteTopicGroup,
} from "@features/favorites";
import * as Actions from "@legacy/Actions/UserCenter";
import { getFavoritePosts } from "@legacy/AsyncActions/UserCenter";
import type { UserRecentTopic } from "@legacy/States/AppState";
import { UserCenterPager as Pager } from "@pages/user-center/pagination";

import { FavoriteTopicGroupManager } from "./FavoriteTopicGroupManager";
import { UserCenterFavoriteTopicItem as Topic } from "./UserCenterFavoriteTopicItem";

const { Search } = Input;
const { Option } = Select;

type RouteParams = {
  page?: string;
  order?: string;
  group?: string;
};

enum PostOrder {
  PostTime = 0, // 发帖时间
  LastReply = 1, // 最后回复时间
  FavorTime = 2, // 收藏时间
}

const defaultGroup = 0;

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { page, order: orderParam, group: groupParam } =
    useParams<RouteParams>();
  const requestPage = Number(page || "1");
  const currentPage = parseInt(page ?? "") || 1;
  const order = Number(orderParam);
  const group = Number(groupParam || "0");
  const keywordRef = React.useRef("");
  const routeRef = React.useRef({ currentPage, group, order });
  routeRef.current = { currentPage, group, order };

  const currentUserFavoriteTopics = useAppSelector(
    (state) => state.userInfo.currentUserFavoriteTopics
  );
  const totalPage = useAppSelector(
    (state) => state.userInfo.totalPage.myfavoriteposts
  );
  const hasTotal = useAppSelector(
    (state) => state.userInfo.hasTotal.myfavoriteposts
  );
  const isLoading = useAppSelector((state) => state.userInfo.isLoading);
  const [favoriteTopicList, setFavoriteTopicList] = React.useState<
    FavoriteTopicGroup[]
  >(defaultFavoriteTopicGroups);

  const updateFavoriteTopicList = async () => {
    try {
      const favoriteTopicListResponse = await getFavoriteAllTopic();
      console.log(favoriteTopicListResponse);
      setFavoriteTopicList(
        favoriteTopicListResponse.errorCode === 0
          ? favoriteTopicListResponse.data
          : defaultFavoriteTopicGroups
      );
    } catch (error) {
      setFavoriteTopicList(defaultFavoriteTopicGroups);
      console.log(error);
    }

    const currentRoute = routeRef.current;
    void navigate(
      `/usercenter/myfavorites/order/${currentRoute.order}/group/${currentRoute.group}/${currentRoute.currentPage}`
    );
  };

  React.useEffect(() => {
    const keyword = getKeyword(location.search);
    // 手动输入企图搜索且排序时重定向
    if (order !== PostOrder.LastReply && keyword !== "") {
      void navigate(
        `/usercenter/myfavorites/order/0/group/0/1?keyword=${keyword}`,
        { replace: true }
      );
    }
    keywordRef.current = keyword;
    void updateFavoriteTopicList();
    // favoriteTopicList.ok && this.setState({ favoriteTopicList: favoriteTopicList.body });
    // console.log(favoriteTopicList.json());
    console.log("componentDidMount");
    dispatch(Actions.changeUserCenterPage("myfavoriteposts"));
  }, []);

  React.useEffect(() => {
    dispatch(
      getFavoritePosts(
        requestPage,
        order,
        group,
        true,
        keywordRef.current
      )
    );
    window.scroll(0, 0);
  }, [dispatch, group, order, requestPage]);

  const changeGroupAndOrderAndKeyword = (
    nextGroup: number,
    nextOrder: number,
    keyword = ""
  ) => {
    console.log("Change", nextGroup, nextOrder, keyword);
    dispatch(Actions.changeUserFavoriteTopicGroup());
    if (keyword) {
      dispatch(getFavoritePosts(1, 0, 0, true, keyword));
      void navigate(
        `/usercenter/myfavorites/order/0/group/0/1?keyword=${keyword}`
      );
    } else {
      dispatch(getFavoritePosts(1, nextOrder, nextGroup, true));
      keywordRef.current = "";
      console.log("changeGroupAndOrderAndKeyword");
      void navigate(
        `/usercenter/myfavorites/order/${nextOrder}/group/${nextGroup}/1`
      );
    }
  };

  const handleSearch = (keyword: string) => {
    keywordRef.current = keyword;
    changeGroupAndOrderAndKeyword(defaultGroup, order, keyword);
  };

  const handleTopicUpdate = () => {
    void updateFavoriteTopicList();
    dispatch(
      getFavoritePosts(
        currentPage,
        order,
        group,
        true,
        keywordRef.current
      )
    );
  };

  if (isLoading) {
    return (
      <div className="user-center-loading">
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
      </div>
    );
  }

  const emptyPage = (
    <div
      className="user-posts"
      style={{
        textAlign: "center",
      }}
    >
      没有主题
    </div>
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
    )
  );
  //添加分隔线
  for (let i = 1; i < userRecentPosts.length; i += 2) {
    userRecentPosts.splice(i, 0, <hr key={i} />);
  }
  // const curPageNum = parseInt(this.props.match.params.page) || 1;

  console.log(favoriteTopicList);
  const options = favoriteTopicList.map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name + " (" + item.count + ")"}
    </Option>
  ));

  return (
    <div className="user-posts">
      <div className="user-post-operator">
        <Select
          value={group}
          style={{
            width: 180,
            marginRight: 40,
          }}
          onChange={(value: number) => {
            changeGroupAndOrderAndKeyword(value, order);
          }}
        >
          {options}
        </Select>
        <Select
          value={order}
          style={{
            width: 180,
            marginRight: 40,
          }}
          onChange={(value: number) => {
            changeGroupAndOrderAndKeyword(group, value);
          }}
        >
          <Option value={PostOrder.PostTime}>按发帖时间排序</Option>
          <Option value={PostOrder.LastReply}>按最后回复排序</Option>
          <Option value={PostOrder.FavorTime}>按收藏顺序排序</Option>
        </Select>
        <Search
          defaultValue={keywordRef.current}
          placeholder="输入关键词"
          onSearch={handleSearch}
          style={{ width: 280, marginRight: 30 }}
          enterButton={
            <div>
              <Button type="primary" style={{ width: 60 }}>
                搜索
              </Button>
            </div>
          }
        />
        <div className="user-post-operator-tips">
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
    </div>
  );
}

export default UserCenterFavoriteTopicsPage;
