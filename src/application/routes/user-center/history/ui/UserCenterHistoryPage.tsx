// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Checkbox, Modal } from "antd";
import { useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "@application/store";
import {
  getCurrentUserBrowsingHistory,
  UserRecentTopicItem as Topic,
} from "@modules/topic";
import {
  selectCurrentUser,
  setBrowsingHistoryEnabled,
  updateCurrentUser,
} from "@modules/session";
import { refreshCurrentUserInfo } from "@legacy/AsyncActions/UserCenter";
import type { UserRecentTopic } from "@legacy/States/AppState";
import { UserCenterPager as Pager } from "@application/routes/user-center/pagination";

type RouteParams = {
  page?: string;
};

/**
 * 用户中心我收藏的帖子组件
 */
export function UserCenterHistoryPage() {
  const dispatch = useAppDispatch();
  const { page } = useParams<RouteParams>();
  const currentPage = parseInt(page ?? "") || 1;
  const currentUser = useAppSelector(selectCurrentUser);
  const browsingHistoryEnabled = currentUser.browsingHistoryEnabled;
  const [currentMyHistoryTopics, setCurrentMyHistoryTopics] = React.useState<
    UserRecentTopic[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalPage, setTotalPage] = React.useState(1);
  const [, setErrorMessage] = React.useState("");
  const [showEnableCheckBoxModal, setShowEnableCheckBoxModal] =
    React.useState(false);

  const loadHistoryPosts = async (nextPage: number) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await getCurrentUserBrowsingHistory(nextPage);
      setCurrentMyHistoryTopics(result.topics);
      if (result.totalPage !== undefined) {
        setTotalPage(result.totalPage);
      }
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const changeBrowsingHistoryEnabled = async (enabled: boolean) => {
    await setBrowsingHistoryEnabled(enabled);
    dispatch(
      updateCurrentUser({
        ...currentUser,
        browsingHistoryEnabled: enabled,
      }),
    );

    if (enabled) {
      await loadHistoryPosts(1);
    } else {
      setCurrentMyHistoryTopics([]);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    dispatch(refreshCurrentUserInfo());
  }, [dispatch]);

  React.useEffect(() => {
    void loadHistoryPosts(currentPage);
    window.scroll(0, 0);
  }, [currentPage]);

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
  const enableCheckBoxModal = (
    <Modal
      open={showEnableCheckBoxModal}
      title={
        browsingHistoryEnabled
          ? "确定要关闭浏览历史吗？"
          : "确定要开启浏览历史吗？"
      }
      okText="确认"
      cancelText="取消"
      onOk={() => {
        setShowEnableCheckBoxModal(false);
        void changeBrowsingHistoryEnabled(!browsingHistoryEnabled);
      }}
      onCancel={() => {
        setShowEnableCheckBoxModal(false);
      }}
      width={"50rem"}
    >
      <div style={{ display: browsingHistoryEnabled ? "none" : "block" }}>
        <p>
          该设置将在网页版和小程序中同步。开启后，将保存最近30天的主题帖浏览历史。
        </p>
      </div>
      <div style={{ display: browsingHistoryEnabled ? "block" : "none" }}>
        <p>该设置将在网页版和小程序中同步。关闭期间不记录主题帖浏览历史。</p>
      </div>
    </Modal>
  );
  const enableCheckbox = (
    <Checkbox
      indeterminate={false}
      onChange={() => {
        setShowEnableCheckBoxModal(true);
      }}
      checked={browsingHistoryEnabled}
    >
      开启历史记录功能
    </Checkbox>
  );

  if (isLoading) {
    return (
      <div className="user-center-loading">
        {enableCheckbox}
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
      </div>
    );
  }

  //state转换为JSX
  const userRecentPosts = currentMyHistoryTopics
    .slice(0, 10)
    .map((item: UserRecentTopic) => (
      <Topic key={item.id} userRecentTopic={item} />
    ));
  //添加分隔线
  for (let i = 1; i < userRecentPosts.length; i += 2) {
    userRecentPosts.splice(i, 0, <hr key={i} />);
  }

  return (
    <div className="user-posts">
      {enableCheckBoxModal}
      {enableCheckbox}
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
      {currentMyHistoryTopics.length === 0 ? (
        emptyPage
      ) : (
        <>
          {userRecentPosts}
          <br />
          <Pager
            currentPage={currentPage}
            totalPage={totalPage}
            href="/usercenter/myhistory/"
            hasTotal={true}
          />
        </>
      )}
    </div>
  );
}

export default UserCenterHistoryPage;
