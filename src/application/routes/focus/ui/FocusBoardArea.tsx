import * as React from "react";

import { getBoardName } from "@modules/board";
import { getMyInfo } from "@modules/session";
import type { FocusBoard } from "@legacy/Props/FocusBoard";
import {
  getStorage,
  setStorage,
} from "@foundation/storage/web-storage";

import { FocusTopicArea } from "./FocusTopicArea";
import styles from "./FocusBoardArea.module.scss";

interface CurrentFocusBoard {
  boardId: number;
  boardName: string;
}

const getInitialBoards = () =>
  (getStorage("focusBoardList") as FocusBoard[] | undefined) ?? [];

const getInitialSelection = (): CurrentFocusBoard => {
  const storedSelection = getStorage("currentFocusBoard") as
    | Partial<CurrentFocusBoard>
    | undefined;
  const boardId = Number(storedSelection?.boardId);

  if (Number.isFinite(boardId) && storedSelection?.boardName) {
    return {
      boardId,
      boardName: storedSelection.boardName,
    };
  }

  return {
    boardId: 0,
    boardName: "全站帖子",
  };
};

/**
 * 表示我关注的版面列表区域。
 */
export function FocusBoardArea() {
  const [boards, setBoards] = React.useState<FocusBoard[]>(getInitialBoards);
  const [selection, setSelection] =
    React.useState<CurrentFocusBoard>(getInitialSelection);

  React.useEffect(() => {
    const loadBoards = async () => {
      const data: FocusBoard[] = [];
      const boardIds = getMyInfo().customBoards;

      // 保持旧实现的逐项顺序，避免版面显示顺序发生变化。
      for (const boardId of boardIds) {
        const boardName = await getBoardName(boardId);
        data.push({ id: boardId, name: boardName });
      }

      setBoards(data);
      setStorage("focusBoardList", data);
    };

    void loadBoards();
  }, []);

  const selectBoard = (boardId: number, boardName: string) => {
    const nextSelection = { boardId, boardName };
    setSelection(nextSelection);
    setStorage("currentFocusBoard", nextSelection);
  };

  const openBoard = (boardId: number) => {
    window.location.href = `/board/${boardId}`;
  };

  const renderBoard = (board: FocusBoard) => (
    <div
      key={board.id}
      className={`${styles["focus-board"]}${
        selection.boardId === board.id ? ` ${styles["focus-hover"]}` : ""
      }`}
      id={`focusBoard_${board.id}`}
      onClick={() => selectBoard(board.id, board.name)}
      onDoubleClick={() => openBoard(board.id)}
    >
      {board.name}
    </div>
  );

  return (
    <div>
      <div className={styles["focus-board-area"]}>
        <div
          className={`${styles["focus-board"]}${
            selection.boardId === 0 ? ` ${styles["focus-hover"]}` : ""
          }`}
          id="focusBoard_0"
          onClick={() => selectBoard(0, "全部帖子")}
          onDoubleClick={() => openBoard(0)}
        >
          全部帖子
        </div>
        {boards.map(renderBoard)}
        <div className={styles["focus-boardTip"]}>
          提示：单击版面标签可切换下方展示内容，双击可直接进入版面
        </div>
      </div>
      <FocusTopicArea id={selection.boardId} name={selection.boardName} />
    </div>
  );
}
