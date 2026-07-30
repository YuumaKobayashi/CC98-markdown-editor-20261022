import * as React from "react";
import moment from "moment";
import { Button, List, Modal, Spin } from "antd";
import { Link, Route, Routes, useParams } from "react-router";

import {
  getBoardInfo,
  getTpUsers,
  isMaster,
} from "@modules/board";
import { cancelStopBoardPost } from "@modules/moderation";
import {
  NotFoundTopic,
  ServerError,
  UnauthorizedBoard,
} from "@legacy/Components/Status";
import DocumentTitle from "@foundation/ui/document-title";

import { BoardActionsAndAdvertisement } from "../../ui/BoardActionsAndAdvertisement";
import { BoardBreadcrumb } from "../../ui/BoardBreadcrumb";
import { LegacyBoardHeader } from "./LegacyBoardHeader";
import { LegacyBoardRecords } from "./LegacyBoardRecords";
import {
  LegacyBoardFeaturedTopics,
  LegacyBoardOneTagTopics,
  LegacyBoardSavedTopics,
  LegacyBoardTopicList,
  LegacyBoardTwoTagTopics,
} from "./LegacyBoardTopicLists";

type LegacyBoardPageParams = {
  boardId?: string;
};

export function LegacyBoardPage() {
  const params = useParams<LegacyBoardPageParams>();
  const boardId = params.boardId;
  const [boardInfo, setBoardInfo] = React.useState<any>({
    bigPaper: "",
    masters: [],
    name: "",
  });
  const [fetchState, setFetchState] = React.useState<any>("ok");
  const [visible, setVisible] = React.useState(false);
  const [tpList, setTpList] = React.useState<any[]>([]);
  const [loading] = React.useState(false);
  const [hasMore] = React.useState(true);
  // 保留旧挂载时以空 boardInfo 计算后不再更新的权限时序。
  const [canCancelStopPost] = React.useState(() =>
    isMaster((boardInfo as any).boardMasters)
  );

  React.useEffect(() => {
    const loadBoard = async () => {
      const data = await getBoardInfo(boardId);
      setBoardInfo(data);
      setFetchState(data);
    };
    void loadBoard();
  }, [boardId]);

  const showModal = async () => {
    const data = await getTpUsers(boardId, 0, 5);
    setVisible(true);
    setTpList(data);
  };

  const cancelTp = async (item) => {
    const response = await cancelStopBoardPost(item.userId, boardId);
    if (response === "ok") {
      const data = await getTpUsers(boardId, 0, 5);
      setTpList(data);
    } else {
      alert(`操作失败,原因：${response}`);
    }
  };

  switch (fetchState) {
    case "ok":
      return <div />;
    case "not found":
      return <NotFoundTopic />;
    case "unauthorized":
      return <UnauthorizedBoard />;
    case "server error":
      return <ServerError />;
    default:
  }

  const recordTopicsUrl = `/board/${boardId}/record/`;
  return (
    <div id="listRoot">
      <DocumentTitle title={`${boardInfo.name} - CC98论坛`} />
      <BoardBreadcrumb boardId={boardId as any} boardInfo={boardInfo} />
      <LegacyBoardHeader
        key={1}
        boardId={boardId}
        boardInfo={boardInfo}
      />
      <BoardActionsAndAdvertisement boardInfo={boardInfo} adsUrl={null} />
      <Routes>
        <Route
          path="/board/:boardid/tags/:tag1Id/:tag2Id/:page?"
          element={<LegacyBoardTwoTagTopics />}
        />
        <Route
          path="/board/:boardId/tag/tag1/:tagId/:page?"
          element={<LegacyBoardOneTagTopics />}
        />
        <Route
          path="/board/:boardId/tag/tag2/:tagId/:page?"
          element={<LegacyBoardOneTagTopics />}
        />
        <Route
          path="/board/:boardId/best/:page?"
          element={<LegacyBoardFeaturedTopics />}
        />
        <Route
          path="/board/:boardId/save/:page?"
          element={<LegacyBoardSavedTopics />}
        />
        <Route
          path="/board/:boardId/record/:page?"
          element={<LegacyBoardRecords />}
        />
        <Route
          path="/board/:boardId/:page?"
          element={<LegacyBoardTopicList />}
        />
      </Routes>
      <div
        style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
      >
        <Link to={recordTopicsUrl}>
          <Button type="primary">查看版面事件</Button>
        </Link>
        <Button
          style={{ marginLeft: "2rem" }}
          type="primary"
          onClick={() => void showModal()}
        >
          小黑屋
        </Button>
      </div>
      <Modal
        title="小黑屋"
        open={visible}
        onOk={(event) => {
          console.log(event);
          setVisible(false);
        }}
        onCancel={(event) => {
          console.log(event);
          setVisible(false);
        }}
        width={canCancelStopPost ? "60rem" : "45rem"}
      >
        <List
          dataSource={tpList}
          pagination={{
            onChange: async (page) => {
              const from = (page - 1) * 5;
              const data = await getTpUsers(boardId, from, 5);
              setTpList((current) => current.concat(data));
            },
            pageSize: 5,
          }}
          renderItem={(item: {
            userId: string;
            userName: string;
            days: string;
            expiredTime: string;
            operatorUserName: string;
          }) => (
            <List.Item key={item.userId}>
              <List.Item.Meta
                title={
                  <a target="_blank" href={`/user/id/${item.userId}`}>
                    {item.userName}
                  </a>
                }
                description={
                  <div>
                    <span>天数:{item.days}</span>
                    <span style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                      到期时间:
                      {moment(item.expiredTime).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                    <Button
                      onClick={() => void cancelTp(item)}
                      type="primary"
                      style={{ display: canCancelStopPost ? "" : "none" }}
                    >
                      解除tp
                    </Button>
                  </div>
                }
              />
              <div>操作人:{item.operatorUserName}</div>
            </List.Item>
          )}
        >
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      </Modal>
    </div>
  );
}
