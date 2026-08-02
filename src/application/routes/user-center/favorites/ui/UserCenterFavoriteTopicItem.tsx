// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Modal } from "antd";
import { Link } from "react-router";

import {
  deleteFavoriteTopic,
  FavoriteTopicGroupSelect,
  setFavoriteTopic,
} from "@modules/favorite-topic";
import type { UserRecentTopic } from "@modules/topic";

import styles from "./UserCenterFavoriteTopicItem.module.scss";

type UserCenterFavoriteTopicItemProps = {
  updateinfo: () => void;
  userRecentTopic: UserRecentTopic;
};

const { confirm } = Modal;

/**
 * 用户最近单个收藏帖子组件
 */
export function UserCenterFavoriteTopicItem({
  updateinfo,
  userRecentTopic,
}: UserCenterFavoriteTopicItemProps) {
  const handleChangeGroup = async (topicId: number) => {
    let select = 0;
    confirm({
      title: "选择收藏分组",
      content: (
        <FavoriteTopicGroupSelect
          option={(groupId) => {
            select = groupId;
          }}
        />
      ),
      onOk: async () => {
        console.log(select);
        try {
          await setFavoriteTopic(topicId, select);
          updateinfo();
        } catch (_error) {
          console.log("Oops errors!");
        }
      },
      onCancel() {},
    });
  };

  return (
    <div className={styles["user-post"]}>
      <div className={styles["user-post-info"]}>
        <Link
          className={styles["user-post-board"]}
          to={`/board/${userRecentTopic.boardId}`}
        >
          {userRecentTopic.boardName}
        </Link>
        <a className={styles["user-post-date"]}>
          {userRecentTopic.time.slice(0, 19).replace("T", " ")}
        </a>
      </div>
      <div className={styles["user-post-content"]}>
        <p>
          <Link to={`/topic/${userRecentTopic.id}`}>
            {userRecentTopic.title}
          </Link>
        </p>
        <div
          style={{ transform: "translate(-50px, 0)", whiteSpace: "nowrap" }}
        >
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <div
                    onClick={async () => {
                      console.log("取消收藏", userRecentTopic.id);
                      await deleteFavoriteTopic(userRecentTopic.id);
                      updateinfo();
                    }}
                  >
                    取消收藏
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    onClick={async () => {
                      console.log("移动分组", userRecentTopic.id);
                      await handleChangeGroup(userRecentTopic.id);
                    }}
                  >
                    移动分组
                  </div>
                </Menu.Item>
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              onClick={(event) => event.preventDefault()}
            >
              <UnorderedListOutlined />
              &nbsp;操作
            </a>
          </Dropdown>
        </div>
        {/*this.props.userRecentTopic.likeCount !== undefined ? <a className="fa-thumbs-o-up">{` ${this.props.userRecentTopic.likeCount}`}</a> : null}
                  {this.props.userRecentTopic.dislikeCount !== undefined ? <a className="fa-thumbs-o-down">{` ${this.props.userRecentTopic.dislikeCount}`}</a> : null*/}
      </div>
    </div>
  );
}

export default UserCenterFavoriteTopicItem;
