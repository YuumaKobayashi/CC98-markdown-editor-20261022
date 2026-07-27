import * as React from "react";
import { Checkbox, Form, Input, Menu, Modal, Select } from "antd";
import type { FormInstance } from "antd";
import { SketchPicker } from "react-color";
import { getBoards } from "@entities/board/api/service";
import {
  addBoardTopTopic,
  cancelBestTopic,
  cancelDisableHot,
  deleteTopic,
  lockTopic,
  moveTopic,
  removeBoardTopTopic,
  setBestTopic,
  setDisableHot,
  setHighlight,
  unLockTopic,
  upTopic,
} from "@features/moderation/api/service";

const FormItem = Form.Item;
const Option = Select.Option;
const Item = Menu.Item;
const CheckboxGroup = Checkbox.Group;

interface TopicManagementDialogProps {
  visible;
  onCancel;
  topicInfo;
  update;
  boardId;
  /**
   * 是否为管理员模式。
   */
  isManager: boolean;
  /**
   * 允许的属性列表。
   */
  permissions: string[];
}

//TODO: Hard code here

const plainOptions = ["加粗", "斜体"];

export function TopicManagementDialog(props: TopicManagementDialogProps) {
  const formRef = React.useRef<FormInstance>(null);
  const [current, setCurrent] = React.useState("1");
  const [option] = React.useState("");
  const [childBoard, setChildBoard] = React.useState<any>("似水流年");
  const [childBoards, setChildBoards] = React.useState<any[]>([
    { name: "似水流年", id: 758 },
    { name: "心灵之约", id: 182 },
    { name: "论坛指南", id: 184 },
  ]);
  const [background, setBackground] = React.useState("#fff");
  const [checkedList, setCheckedList] = React.useState<any[]>([]);
  const [checkAll, setCheckAll] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [days, setDays] = React.useState<any>(0);
  const [boardsData, setBoardsData] = React.useState<any[]>([]);

  const onCreate = async () => {
    try {
      const values = await formRef.current!.validateFields();
      const reason = values.reason;
      const parsedDays = parseInt(days);
      let status = "ok";
      switch (current) {
        // 锁定。
        case "1":
          // 解锁。
          if (props.topicInfo.state === 1) {
            status = await unLockTopic(
              props.topicInfo.id,
              props.boardId,
              reason
            );
          }
          // 锁定。
          else {
            status = await lockTopic(
              props.topicInfo.id,
              props.boardId,
              reason,
              parsedDays
            );
          }
          break;
        // 热门。
        case "2":
          // 允许热门。
          if (props.topicInfo.disableHot) {
            status = await cancelDisableHot(props.topicInfo.id, reason);
          }
          // 禁止热门。
          else {
            status = await setDisableHot(props.topicInfo.id, reason);
          }
          break;
        // 删除。
        case "3":
          status = await deleteTopic(props.topicInfo.id, reason);
          break;
        // 移动。
        case "4":
          status = await moveTopic(props.topicInfo.id, childBoard, reason);
          break;
        // 提升。
        case "5":
          status = await upTopic(
            props.topicInfo.id,
            props.boardId,
            reason
          );
          break;
        // 固顶。
        case "6":
          // 取消固顶。
          if (props.topicInfo.topState === 2) {
            status = await removeBoardTopTopic(
              props.topicInfo.id,
              props.boardId,
              reason
            );
          }
          // 固顶。
          else {
            status = await addBoardTopTopic(
              props.topicInfo.id,
              props.boardId,
              2,
              parsedDays,
              reason
            );
          }
          break;
        // 全站固顶。
        case "7":
          // 取消全站固顶。
          if (props.topicInfo.topState === 4) {
            status = await removeBoardTopTopic(
              props.topicInfo.id,
              props.boardId,
              reason
            );
          }
          // 全站固顶。
          else {
            status = await addBoardTopTopic(
              props.topicInfo.id,
              props.boardId,
              4,
              parsedDays,
              reason
            );
          }
          break;
        // 加精。
        case "8":
          // 解除加精。
          if (props.topicInfo.bestState === 1) {
            status = await cancelBestTopic(props.topicInfo.id, reason);
          }
          // 加精。
          else {
            status = await setBestTopic(props.topicInfo.id, reason);
          }
          break;
        // 高亮。
        case "9": {
          let isBold = false;
          let isItalic = false;
          for (const item of checkedList) {
            if (item === "加粗") isBold = true;
            if (item === "斜体") isItalic = true;
          }
          await setHighlight(
            props.topicInfo.id,
            isBold,
            isItalic,
            background,
            parsedDays,
            reason
          );
          break;
        }
      }
      if (status === "ok") {
        props.update();
        props.onCancel();
      } else {
        alert("操作失败");
      }
    } catch (_error) {
      return;
    }
  };

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
  };

  const handleBoardChange = (value) => {
    const boardId = value;
    for (const board of boardsData) {
      if (board.id == boardId) {
        setChildBoards(board.boards);
        setChildBoard(board.boards[0].name);
        break;
      }
    }
  };

  const onDaysChange = (value) => {
    setDays(value);
  };

  const onChildBoardChange = (value) => {
    setChildBoard(value);
  };

  const handleClick = (event) => {
    console.log("click ", event);
    setCurrent(event.key);
  };

  const onChange = (nextCheckedList) => {
    setCheckedList(nextCheckedList);
    setIndeterminate(
      !!nextCheckedList.length &&
        nextCheckedList.length < plainOptions.length
    );
    setCheckAll(nextCheckedList.length === plainOptions.length);
  };

  const onCheckAllChange = (event) => {
    setCheckedList(event.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(event.target.checked);
  };

  React.useEffect(() => {
    const loadBoards = async () => {
      const previousBoards = localStorage.getItem("boardsInfo");
      if (previousBoards && previousBoards.indexOf("obj-") !== 0) {
        localStorage.removeItem("boardsInfo");
      }
      const response = await getBoards();
      setBoardsData(response);
    };

    loadBoards();
  }, []);

  const boards = boardsData;
  console.log(childBoards);
  const boardOptions = boards.map((board) => (
    <Option key={board.id}>{board.name}</Option>
  ));
  const childBoardOptions = childBoards.map((board) => {
    if (board.id !== 182) {
      return <Option key={board.id}>{board.name}</Option>;
    }
    return null;
  });

  const formWithReason = (
    <Form ref={formRef}>
      <FormItem
        label="理由"
        name="reason"
        rules={[{ required: true, message: "请输入理由" }]}
      >
        <Input />
      </FormItem>
    </Form>
  );
  const formWithDays = (
    <Form ref={formRef}>
      <FormItem label="天数">
        <Select value={days} onChange={onDaysChange}>
          {current === "1" ? <Option key="0">0</Option> : null}
          <Option key="7">7</Option>
          <Option key="14">14</Option>
          <Option key="30">30</Option>
          <Option key="98">98</Option>
          <Option key="180">180</Option>
          <Option key="365">365</Option>
          <Option key="1000">1000</Option>
          <Option key="10000">10000 (作为永久使用)</Option>
        </Select>
      </FormItem>
      <FormItem
        label="理由"
        name="reason"
        rules={[{ required: true, message: "请输入理由" }]}
      >
        <Input />
      </FormItem>
    </Form>
  );
  const formWithBoardMessage = (
    <Form ref={formRef}>
      <FormItem
        label="理由"
        name="reason"
        rules={[{ required: true, message: "请输入理由" }]}
      >
        <Input />
      </FormItem>
      <FormItem>
        <Select
          defaultValue={boards.length > 0 ? boards[0].name : ""}
          style={{ width: 120 }}
          onChange={handleBoardChange}
        >
          {boardOptions}
        </Select>
        <Select
          defaultValue={childBoards.length > 0 ? childBoards[0].name : ""}
          style={{ marginLeft: "2rem", width: 120 }}
          onChange={onChildBoardChange}
          key={childBoards.length > 0 ? childBoards[0].name : ""}
        >
          {childBoardOptions}
        </Select>
      </FormItem>
    </Form>
  );
  const formWithColorPicker = (
    <Form ref={formRef}>
      <FormItem>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Check all
        </Checkbox>
        <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={onChange}
        />
      </FormItem>
      <FormItem label="天数">
        <Select value={days} onChange={onDaysChange}>
          {current === "1" ? <Option key="0">0</Option> : null}
          <Option key="7">7</Option>
          <Option key="14">14</Option>
          <Option key="30">30</Option>
          <Option key="98">98</Option>
          <Option key="180">180</Option>
          <Option key="365">365</Option>
          <Option key="1000">1000</Option>
          <Option key="10000">10000 (作为永久使用)</Option>
        </Select>
      </FormItem>
      <FormItem
        label="理由"
        name="reason"
        rules={[{ required: true, message: "请输入理由" }]}
      >
        <Input />
      </FormItem>
      <FormItem label="颜色">
        <SketchPicker
          color={background}
          onChangeComplete={handleChangeComplete}
        />
      </FormItem>
    </Form>
  );

  let rcForm = null;
  switch (current) {
    case "1":
      if (props.topicInfo.state === 1) rcForm = formWithReason;
      else rcForm = formWithDays;
      break;
    case "2":
      rcForm = formWithReason;
      break;
    case "3":
      rcForm = formWithReason;
      break;
    case "4":
      rcForm = formWithBoardMessage;
      break;
    case "5":
      rcForm = formWithReason;
      break;
    case "6":
      if (props.topicInfo.topState === 2) rcForm = formWithReason;
      else rcForm = formWithDays;
      break;
    case "7":
      if (props.topicInfo.topState === 4) rcForm = formWithReason;
      else rcForm = formWithDays;
      break;
    case "8":
      rcForm = formWithReason;
      break;
    case "9":
      rcForm = formWithColorPicker;
      break;
  }

  return (
    <Modal
      open={props.visible}
      title="帖子管理"
      okText="确认"
      cancelText="取消"
      onOk={onCreate}
      onCancel={props.onCancel}
      width={"50rem"}
      maskClosable={false}
    >
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        style={{
          display: "flex",
          marginBottom: "1rem",
          justifyContent: "space-around",
        }}
      >
        <Item key="1">
          {props.topicInfo.state === 1 ? "解锁" : "锁定"}
        </Item>
        <Item key="2">
          {props.topicInfo.disableHot ? "允许热门" : "禁止热门"}
        </Item>
        <Item key="3">删除</Item>
        <Item key="4">移动</Item>
        <Item key="5">提升</Item>
        <Item key="6">
          {props.topicInfo.topState === 2 ? "取消固顶" : "固顶"}
        </Item>
        <Item key="7">
          {props.topicInfo.topState === 4 ? "取消全站固顶" : "全站固顶"}
        </Item>
        <Item key="8">
          {props.topicInfo.bestState === 1 ? "解除精华" : "加精"}
        </Item>
        <Item key="9">高亮</Item>
      </Menu>

      {rcForm}
    </Modal>
  );
}
