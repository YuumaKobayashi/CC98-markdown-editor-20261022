import * as React from "react";
import { useParams } from "react-router";

import { getBoardRecord, getBoardTag } from "@modules/board";
import type { BoardEvent } from "@legacy/States/BoardEvent";
import { Pager } from "@foundation/ui/pagination";

import { BoardModerationRecordItem } from "../../ui/BoardModerationRecordItem";

type BoardRecordRouteParams = {
  boardId?: string;
  page?: string;
};

export function LegacyBoardRecords() {
  const params = useParams<BoardRecordRouteParams>();
  const currentPage = params.page ? parseInt(params.page) : 1;
  const boardIdRef = React.useRef(params.boardId);
  const [state, setState] = React.useState<{
    totalPage: number;
    data: BoardEvent[];
  }>({
    totalPage: 1,
    data: [],
  });

  React.useEffect(() => {
    const loadRecords = async () => {
      const data = await getBoardRecord(
        boardIdRef.current as any,
        (currentPage - 1) * 20,
        20
      );
      const totalPage = parseInt(((data.count - 0.5) / 20 + 1).toString());
      await getBoardTag(boardIdRef.current);
      setState({ totalPage, data: data.boardEvents });
    };

    void loadRecords();
  }, [currentPage, params.boardId]);

  const boardRecordUrl = `/board/${params.boardId}/record/`;
  const records = state.data.map((item) => (
    <BoardModerationRecordItem
      id={item.id}
      topicId={item.topicId}
      boardId={item.boardId}
      targetUserName={item.targetUserName}
      operatorUserName={item.operatorUserName}
      content={item.content}
      time={item.time}
      ip={item.ip}
      isDeleted={item.isDeleted}
    />
  ));

  return (
    <div className="listContent ">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pager
          page={currentPage}
          totalPage={state.totalPage}
          url={boardRecordUrl}
        />
      </div>
      <div className="column tagColumn">
        <div className="row board-topBar">
          <div className="row" style={{ alignItems: "center" }}>
            <div
              className="listContentTag"
              style={{ alignItems: "center", width: "5rem", textAlign: "center" }}
            >
              <span>对象</span>
            </div>
            <div
              className="listContentTag"
              style={{
                alignItems: "center",
                width: "46rem",
                textAlign: "center",
              }}
            >
              <span>内容</span>
            </div>
            <div
              className="listContentTag"
              style={{ alignItems: "center", width: "6rem", textAlign: "center" }}
            >
              <span>时间</span>
            </div>
            <div
              className="listContentTag"
              style={{
                alignItems: "center",
                width: "11rem",
                textAlign: "center",
              }}
            >
              <span>操作人</span>
            </div>
          </div>
        </div>
        <div>{records}</div>
      </div>
      <Pager
        page={currentPage}
        totalPage={state.totalPage}
        url={boardRecordUrl}
      />
    </div>
  );
}
