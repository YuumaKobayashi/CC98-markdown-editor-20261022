import * as React from "react";

import { cc98Fetch } from "@foundation/api/http";
import DocumentTitle from "@shared/ui/document-title";
import type { RootBoardState } from "../model/board-list";
import { BoardListSection } from "./BoardListSection";

export function BoardListPage() {
  const [data, setData] = React.useState<RootBoardState[]>([]);

  //TODO: 统一版面数据信息
  React.useEffect(() => {
    const loadBoards = async () => {
      const response = await cc98Fetch("/Board/all");
      const boards = (await response.json()) as RootBoardState[];
      setData(boards);
    };

    void loadBoards();
  }, []);

  const scrollToBoard = (id: string) => {
    document.getElementById(id)?.scrollIntoView();
  };

  return (
    <div className="row" style={{ width: "1140px" }}>
      <DocumentTitle title="版面列表 - CC98论坛" />
      <div className="boardList">
        {data.map((item) => (
          <BoardListSection key={item.id} data={item} />
        ))}
      </div>
      <div className="boardGuide">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => scrollToBoard(item.name)}
            className="row boardOption"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
