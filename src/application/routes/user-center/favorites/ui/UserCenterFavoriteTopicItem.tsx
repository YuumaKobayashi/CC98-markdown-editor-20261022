// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { ConfirmDialog } from "@foundation/ui/dialog";
import { DropdownMenu } from "@foundation/ui/dropdown-menu";
import { UnorderedListOutlined } from "@foundation/ui/icon";
import { Link } from "react-router";

import {
  deleteFavoriteTopic,
  setFavoriteTopic,
} from "@modules/favorite-topic/api/service";
import { FavoriteTopicGroupSelect } from "@modules/favorite-topic/ui/FavoriteTopicGroupSelect";
import type { UserRecentTopic } from "@modules/topic/model/view-model";

import styles from "./UserCenterFavoriteTopicItem.module.scss";

type UserCenterFavoriteTopicItemProps = {
  updateinfo: () => void;
  userRecentTopic: UserRecentTopic;
};

/**
 * 用户最近单个收藏帖子组件
 */
export function UserCenterFavoriteTopicItem({
  updateinfo,
  userRecentTopic,
}: UserCenterFavoriteTopicItemProps) {
  const [moveOpen, setMoveOpen] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState(0);
  const [movePending, setMovePending] = React.useState(false);

  const openMoveDialog = () => {
    console.log("移动分组", userRecentTopic.id);
    setSelectedGroupId(0);
    setMoveOpen(true);
  };

  const confirmMove = async () => {
    console.log(selectedGroupId);
    setMovePending(true);
    try {
      await setFavoriteTopic(userRecentTopic.id, selectedGroupId);
      updateinfo();
    } catch (_error) {
      console.log("Oops errors!");
    } finally {
      setMovePending(false);
      setMoveOpen(false);
    }
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
        <div className={styles.actions}>
          <DropdownMenu
            ariaLabel="收藏主题操作"
            triggerClassName={styles.actionTrigger}
            items={[
              {
                key: "remove",
                label: "取消收藏",
                onSelect: async () => {
                  console.log("取消收藏", userRecentTopic.id);
                  await deleteFavoriteTopic(userRecentTopic.id);
                  updateinfo();
                },
              },
              {
                key: "move",
                label: "移动分组",
                onSelect: openMoveDialog,
              },
            ]}
          >
            <UnorderedListOutlined />
            &nbsp;操作
          </DropdownMenu>
        </div>
      </div>
      <ConfirmDialog
        open={moveOpen}
        title="选择收藏分组"
        onOpenChange={setMoveOpen}
        onConfirm={confirmMove}
        confirmLoading={movePending}
      >
        <FavoriteTopicGroupSelect option={setSelectedGroupId} />
      </ConfirmDialog>
    </div>
  );
}

export default UserCenterFavoriteTopicItem;
