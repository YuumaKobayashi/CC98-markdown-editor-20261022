import * as React from "react";
import { Link } from "react-router";

import type { UserInfo } from "@legacy/States/AppState";
import { followUser, unfollowUser } from "../api/service";
import styles from "./UserFollowCard.module.scss";

interface UserFollowCardProps {
  user: UserInfo;
  onFollowingChange: (userId: number, isFollowing: boolean) => void;
}

interface FollowState {
  buttonIsDisabled: boolean;
  buttonInfo: string;
  isFollowing: boolean;
}

const createInitialFollowState = (isFollowing: boolean): FollowState => ({
  buttonInfo: isFollowing ? "已关注" : "关注",
  buttonIsDisabled: false,
  isFollowing,
});

//用户中心我的关注&我的粉丝用户通用组件
export function UserFollowCard({
  user,
  onFollowingChange,
}: UserFollowCardProps) {
  const [followState, setFollowState] = React.useState(() =>
    createInitialFollowState(user.isFollowing),
  );

  const unfollow = async () => {
    setFollowState({
      buttonIsDisabled: true,
      buttonInfo: "取关中",
      isFollowing: true,
    });
    const succeeded = await unfollowUser(user.id);
    if (succeeded) {
      setFollowState({
        buttonIsDisabled: false,
        buttonInfo: "重新关注",
        isFollowing: false,
      });
      onFollowingChange(user.id, false);
      return;
    }
    setFollowState({
      buttonIsDisabled: false,
      buttonInfo: "取关失败",
      isFollowing: true,
    });
  };

  const follow = async () => {
    setFollowState({
      buttonIsDisabled: true,
      buttonInfo: "关注中",
      isFollowing: false,
    });
    const result = await followUser(user.id);
    if (result === true) {
      setFollowState({
        buttonIsDisabled: false,
        buttonInfo: "已关注",
        isFollowing: true,
      });
      onFollowingChange(user.id, true);
      return;
    }
    if (result === "follow_count_limited") {
      setFollowState({
        buttonIsDisabled: false,
        buttonInfo: "已达上限",
        isFollowing: false,
      });
      return;
    }
    setFollowState({
      buttonIsDisabled: false,
      buttonInfo: "关注失败",
      isFollowing: false,
    });
  };

  const showUnfollowLabel = () => {
    if (followState.isFollowing && !followState.buttonIsDisabled) {
      setFollowState((currentState) => ({
        ...currentState,
        buttonInfo: "取消关注",
      }));
    }
  };

  const showFollowingLabel = () => {
    if (followState.isFollowing && !followState.buttonIsDisabled) {
      setFollowState((currentState) => ({
        ...currentState,
        buttonInfo: "已关注",
      }));
    }
  };

  return (
    <div className={styles["user-center-myfollowings-user"]}>
      <img src={user.portraitUrl} />
      <p>
        <span className={styles["user-center-myfollowings-user-id"]}>
          <Link to={`/user/id/${user.id}`}>{user.name}</Link>
        </span>
        帖数
        <span className={styles["user-center-myfollowings-user-posts"]}>
          {user.postCount}
        </span>
        粉丝
        <span className={styles["user-center-myfollowings-user-fans"]}>
          {user.fanCount}
        </span>
      </p>
      <button
        type="button"
        className={followState.isFollowing ? "" : styles["user-follow"]}
        onMouseOver={showUnfollowLabel}
        onMouseLeave={showFollowingLabel}
        onClick={followState.isFollowing ? unfollow : follow}
        disabled={followState.buttonIsDisabled}
      >
        {followState.buttonInfo}
      </button>
      <Link to={`/message/message?id=${user.id}`}>
        <button className={styles["user-message"]} type="button">
          私信
        </button>
      </Link>
    </div>
  );
}
