import * as React from "react";
import type { IBoard, ITopic } from "@cc98/api";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  List,
  Modal,
  notification,
  Select,
  Spin,
  Transfer,
} from "antd";
import moment from "moment";

import {
  getTpUsers,
  isMaster,
} from "@modules/board";
import { cancelStopBoardPost } from "@modules/moderation";

import {
  getBoardRecords,
  multiDelete,
  multiLock,
} from "../api/service";

const Option = Select.Option;

interface BoardFooterActionsProps {
  data: IBoard;
  list: ITopic[];
}

interface BoardBatchManagerProps {
  data: IBoard;
  list: ITopic[];
  visible: boolean;
  onClose: () => void;
}

interface BoardModerationRecordListProps {
  id: string;
}

interface BoardRecordItem {
  id: string;
  topicId: string;
  content: string;
  targetUserName: string;
  time: string;
  operatorUserName: string;
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
        className="row"
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

export function BoardBatchManager({
  data,
  list,
  visible,
  onClose,
}: BoardBatchManagerProps) {
  const [targetKeys, setTargetKeys] = React.useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<any[]>([]);
  const [lockVisible, setLockVisible] = React.useState(false);
  const [deleteVisible, setDeleteVisible] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [value, setValue] = React.useState(7);

  const handleChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const openNotification = () => {
    const args = {
      message: "操作错误",
      description: "请至少选择一个帖子",
      duration: 4.5,
      icon: <CloseCircleOutlined style={{ color: "red" }} />,
    };
    notification.open(args);
  };

  const submitDelete = async () => {
    if (targetKeys.length === 0) {
      openNotification();
      return;
    }
    await multiDelete(targetKeys, reason);
    setDeleteVisible(false);
  };

  const submitLock = async () => {
    if (targetKeys.length === 0) {
      openNotification();
      return;
    }
    await multiLock(targetKeys, reason, value);
    setLockVisible(false);
  };

  const dataSource = [];
  for (const item of list) {
    dataSource.push({
      key: item.id.toString(),
      title: item.title,
    });
  }

  return (
    <>
      <Modal
        title="批量管理"
        open={visible}
        onOk={onClose}
        onCancel={onClose}
        maskClosable={false}
        width={"50rem"}
        footer={[
          <Button onClick={onClose}>取消</Button>,
          <Button type="primary" onClick={() => setLockVisible(true)}>
            锁沉
          </Button>,
          <Button type="primary" onClick={() => setDeleteVisible(true)}>
            删除
          </Button>,
        ]}
      >
        <Transfer
          dataSource={dataSource}
          titles={["Source", "Target"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={(item) => item.title}
          listStyle={{ width: "20rem", height: "40rem" }}
        />
      </Modal>
      <Modal
        title="批量删除"
        open={deleteVisible}
        onOk={submitDelete}
        onCancel={() => setDeleteVisible(false)}
      >
        <div>理由</div>
        <Select
          style={{ width: 120 }}
          mode="tags"
          onSelect={(nextReason) => {
            setReason(nextReason.toString());
            console.log(nextReason);
          }}
        >
          <Option value="重复发帖">重复发帖</Option>
          <Option value="管理要求">管理要求</Option>
          <Option value="已解决">已解决</Option>
          <Option value="内容不符">内容不符</Option>
          <Option value="违反版规">违反版规</Option>
        </Select>
      </Modal>
      <Modal
        title="批量锁沉"
        open={lockVisible}
        onOk={submitLock}
        onCancel={() => setLockVisible(false)}
      >
        <div>理由</div>
        <Select
          style={{ width: 120 }}
          mode="tags"
          onSelect={(nextReason) => setReason(nextReason.toString())}
        >
          <Option value="重复发帖">重复发帖</Option>
          <Option value="管理要求">管理要求</Option>
          <Option value="已解决">已解决</Option>
          <Option value="内容不符">内容不符</Option>
          <Option value="违反版规">违反版规</Option>
        </Select>
        <div>天数</div>
        <Select
          style={{ width: 120 }}
          defaultValue="7"
          onSelect={(nextValue) => setValue(parseInt(nextValue.toString()))}
        >
          <Option value="7">7</Option>
          <Option value="30">30</Option>
          <Option value="98">98</Option>
          <Option value="1000">1000</Option>
        </Select>
      </Modal>
    </>
  );
}

export function BoardModerationRecordList({
  id,
}: BoardModerationRecordListProps) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadRecords = async () => {
      setLoading(true);
      const nextData = await getBoardRecords(id, 0);
      setData(nextData);
      setLoading(false);
    };

    void loadRecords();
  }, []);

  const handlePageChange = async (page: number) => {
    setLoading(true);
    const from = (page - 1) * 7;
    const response = await getBoardRecords(id, from);
    const list = response.boardEvents;
    response.boardEvents = list;
    setData(response);
    setLoading(false);
  };

  return (
    data && (
      <List
        dataSource={data ? data.boardEvents : []}
        pagination={{
          onChange: handlePageChange,
          pageSize: 7,
          total: data.count,
        }}
        // TODO: item type
        renderItem={(item: BoardRecordItem) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={
                <a target="_blank" href={`/topic/${item.topicId}`}>
                  {item.content}
                </a>
              }
              description={
                <div>
                  <span>对象:{item.targetUserName || "匿名"}</span>
                  <span style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                    时间:
                    {moment(item.time).format("YYYY-MM-DD HH:mm:ss")}
                  </span>
                </div>
              }
            />
            <div>操作人:{item.operatorUserName}</div>
          </List.Item>
        )}
      >
        {loading && (
          <div className="demo-loading-container">
            <Spin />
          </div>
        )}
      </List>
    )
  );
}
