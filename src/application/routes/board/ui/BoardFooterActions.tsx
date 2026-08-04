import * as React from "react";
import type { BoardInfo } from "@modules/board/model/types";
import type { TopicInfo } from "@modules/topic/model/dto";
import { Button, List, Modal, Spin } from "antd";
import moment from "moment";

import {
  getTpUsers,
  isMaster,
} from "@modules/board/api/service";
import { cancelStopBoardPost } from "@modules/moderation/api/service";

import { BoardBatchManager } from "./BoardBatchManager";
import { BoardModerationRecordList } from "./BoardModerationRecordList";

export { BoardBatchManager } from "./BoardBatchManager";
export { BoardModerationRecordList } from "./BoardModerationRecordList";

interface BoardFooterActionsProps {
  data: BoardInfo;
  list: TopicInfo[];
}

export function BoardFooterActions({
  data,
  list,
}: BoardFooterActionsProps) {
  const [visible, setVisible] = React.useState(false);
  const [tpList, setTpList] = React.useState<any[]>([]);
  const [loading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [manageVisible, setManageVisible] = React.useState(false);
  const [recordVisible, setRecordVisible] = React.useState(false);

  const showModal = async () => {
    const result = await getTpUsers(data.id, 0, 6);
    let nextHasMore = true;
    if (result.length < 21) {
      nextHasMore = false;
    } else {
      result.pop();
    }
    setVisible(true);
    setTpList(result);
    setHasMore(nextHasMore);
  };

  const handleOk = () => {
    setManageVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const cancelTp = async (item) => {
    const response = await cancelStopBoardPost(item.userId, data.id);
    if (response === "ok") {
      const nextData = await getTpUsers(data.id, 0, 5);
      setTpList(nextData);
    } else {
      alert(`操作失败,原因：${response}`);
    }
  };

  const openRecord = () => setRecordVisible(true);
  const boardMaster = isMaster(data.boardMasters);

  return (
    <>
      <div
        className="cc98-row"
        style={{ width: "100%", justifyContent: "flex-end" }}
      >
        <Button onClick={openRecord}>查看版面事件</Button>
        <Button onClick={showModal}>小黑屋</Button>
        {boardMaster && (
          <Button onClick={() => setManageVisible(true)}>批量管理</Button>
        )}
      </div>

      <BoardBatchManager
        key={manageVisible.toString()}
        data={data}
        list={list}
        visible={manageVisible}
        onClose={handleOk}
      />
      <Modal
        title="小黑屋"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={boardMaster ? "60rem" : "45rem"}
      >
        <List
          dataSource={tpList}
          pagination={{
            onChange: async (page) => {
              const from = (page - 1) * 5;
              const nextData = await getTpUsers(data.id, from, 6);
              if (nextData.length > 0) {
                tpList.pop();
                const result = tpList.concat(nextData);
                setTpList(result);
              }
            },
            pageSize: 5,
            simple: true,
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
                  item.userName ? (
                    <a target="_blank" href={`/user/id/${item.userId}`}>
                      {item.userName}
                    </a>
                  ) : (
                    <div>匿名</div>
                  )
                }
                description={
                  <div>
                    <span>天数:{item.days}</span>
                    <span style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                      到期时间:
                      {moment(item.expiredTime).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                    <Button
                      onClick={() => cancelTp(item)}
                      type="primary"
                      style={{ display: boardMaster ? "" : "none" }}
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
      <Modal
        title="版面事件"
        open={recordVisible}
        onOk={() => setRecordVisible(false)}
        onCancel={() => setRecordVisible(false)}
        width={"60rem"}
      >
        <BoardModerationRecordList id={data.id.toString()} />
      </Modal>
    </>
  );
}
