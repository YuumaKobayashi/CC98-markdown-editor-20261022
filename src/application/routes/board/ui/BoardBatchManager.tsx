import * as React from "react";
import type { IBoard, ITopic } from "@cc98/api";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Modal, notification, Select, Transfer } from "antd";

import { multiDelete, multiLock } from "../api/service";

const Option = Select.Option;

interface BoardBatchManagerProps {
  data: IBoard;
  list: ITopic[];
  visible: boolean;
  onClose: () => void;
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
