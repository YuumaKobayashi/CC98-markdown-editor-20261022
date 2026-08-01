import * as React from "react";

import { useAppSelector } from "@application/store";
import { getCurrentUserFavoriteBoards } from "@modules/board";
import { selectCurrentUser } from "@modules/session";
import type { UserFavoritesBoardInfo } from "@legacy/States/AppState";
import { UserFavoriteBoardCard } from "./UserFavoriteBoardCard";
import styles from "../../../../layouts/user-area/UserArea.module.scss";

/**
 * 用户关注的版面信息
 */
export function UserFavoriteBoards() {
  const currentBoardIds = useAppSelector(
    (state) => selectCurrentUser(state).customBoards,
  );
  const [boards, setBoards] = React.useState<UserFavoritesBoardInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setErrorMessage] = React.useState("");
  const emptyStyle: React.CSSProperties = {
    marginTop: "2rem",
    textAlign: "center",
  };

  React.useEffect(() => {
    const loadFavoriteBoards = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const boardsInfo =
          await getCurrentUserFavoriteBoards(currentBoardIds);
        setBoards(boardsInfo);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : String(error),
        );
      }
    };

    void loadFavoriteBoards();
  }, []);

  if (isLoading) {
    return (
      <div className={styles["user-center-loading"]}>
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
