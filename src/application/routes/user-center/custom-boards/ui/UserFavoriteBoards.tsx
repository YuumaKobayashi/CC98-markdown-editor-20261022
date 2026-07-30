import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import * as Actions from "@legacy/Actions/UserCenter";
import { getCurrentUserFavoriteBoards } from "@legacy/AsyncActions/UserCenter";
import type { UserFavoritesBoardInfo } from "@legacy/States/AppState";
import { UserFavoriteBoardCard } from "./UserFavoriteBoardCard";

/**
 * 用户关注的版面信息
 */
export function UserFavoriteBoards() {
  const dispatch = useAppDispatch();
  const boards = useAppSelector(
    (state) => state.userInfo.currentUserFavoriteBoards,
  );
  const isLoading = useAppSelector((state) => state.userInfo.isLoading);
  const emptyStyle: React.CSSProperties = {
    marginTop: "2rem",
    textAlign: "center",
  };

  React.useEffect(() => {
    dispatch(getCurrentUserFavoriteBoards());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(Actions.changeUserCenterPage("myfavoriteboards"));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="user-center-loading">
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw"></p>
      </div>
    );
  }
  if (boards.length === 0) {
    return <div style={emptyStyle}>没有关注</div>;
  }

  const boardItems = boards.map((item: UserFavoritesBoardInfo) => (
    <UserFavoriteBoardCard key={item.id} board={item} />
  ));
  for (let index = 1; index < boardItems.length; index += 2) {
    boardItems.splice(index, 0, <hr key={index} />);
  }

  return <div>{boardItems}</div>;
}
