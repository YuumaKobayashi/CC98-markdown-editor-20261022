import * as React from "react";

import { getBoardList } from "@modules/board/api/service";
import DocumentTitle from "@foundation/ui/document-title";
import styles from "./BoardListPage.module.scss";
import type { RootBoardState } from "../model/board-list";
import { BoardListSection } from "./BoardListSection";

export function BoardListPage() {
  const [data, setData] = React.useState<RootBoardState[]>([]);

  //TODO: 统一版面数据信息
  React.useEffect(() => {
    const loadBoards = async () => {
      const boards = await getBoardList();
      setData(boards);
    };

    void loadBoards();
  }, []);

  const scrollToBoard = (id: string) => {
    document.getElementById(id)?.scrollIntoView();
  };

  return (
    <div className="cc98-row" style={{ width: "1140px" }}>
      <DocumentTitle title="版面列表 - CC98论坛" />
      <div className={styles.boardList}>
        {data.map((item) => (
          <BoardListSection key={item.id} data={item} />
        ))}
      </div>
      <div className={styles.boardGuide}>
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => scrollToBoard(item.name)}
            className={`cc98-row ${styles.boardOption}`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
