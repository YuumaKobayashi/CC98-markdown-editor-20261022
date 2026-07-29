import * as React from "react";
import { Link } from "react-router";

import { getToken } from "@features/auth/api/session";
import type { UserFavoritesBoardInfo } from "@legacy/States/AppState";
import { cc98Fetch } from "@foundation/api/http";

interface UserFavoriteBoardCardProps {
  board: UserFavoritesBoardInfo;
}

interface FollowState {
  buttonIsDisabled: boolean;
  buttonInfo: string;
  isFollowing: boolean;
}

const initialFollowState: FollowState = {
  buttonInfo: "取消关注",
  buttonIsDisabled: false,
  isFollowing: true,
};

export function UserFavoriteBoardCard({ board }: UserFavoriteBoardCardProps) {
  const [followState, setFollowState] = React.useState(initialFollowState);

  const requestFollowChange = async (method: "DELETE" | "PUT") => {
    const token = await getToken();
    const headers = new Headers();
    headers.append("Authorization", token);
    return cc98Fetch(`/me/custom-board/${board.id}`, { method, headers });
  };

  const unfollow = async () => {
    setFollowState({
      buttonIsDisabled: true,
      buttonInfo: "取关中",
      isFollowing: true,
    });
    try {
      const response = await requestFollowChange("DELETE");
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      setFollowState({
        buttonIsDisabled: false,
        buttonInfo: "重新关注",
        isFollowing: false,
      });
    } catch {
      setFollowState({
        buttonIsDisabled: false,
        buttonInfo: "取关失败",
        isFollowing: true,
      });
    }
  };

  const follow = async () => {
    setFollowState({
      buttonIsDisabled: true,
      buttonInfo: "关注中",
      isFollowing: false,
    });
    try {
      const response = await requestFollowChange("PUT");
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      setFollowState({
        buttonIsDisabled: false,
        buttonInfo: "取消关注",
        isFollowing: true,
      });
    } catch {
      setFollowState({
        buttonIsDisabled: false,
        buttonInfo: "关注失败",
        isFollowing: false,
      });
    }
  };

  return (
    <div className="user-center-myfavorite-board">
      <Link to={`/board/${board.id}`} title={board.name}>
        <img src={`/static/images/_${board.name}.png`} />
      </Link>
      <div className="user-center-myfavorite-board-info">
        <Link to={`/board/${board.id}`} title={board.name}>
          <h2>{board.name}</h2>
        </Link>
        <p>
          版主：{board.boardMasters.join(" ")} 今日主题 {board.todayCount} / 总主题{" "}
          {board.topicCount}
        </p>
      </div>
      <button
        type="button"
        className={followState.isFollowing ? "" : "user-follow-board"}
        onClick={followState.isFollowing ? unfollow : follow}
        disabled={followState.buttonIsDisabled}
      >
        {followState.buttonInfo}
      </button>
    </div>
  );
}
