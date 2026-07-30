import * as React from "react";
import { Form, Input, InputNumber, Menu, Modal, Select, Tag } from "antd";
import type { FormInstance } from "antd";
import {
  addPrestige,
  cancelStopBoardPost,
  deductPrestige,
  deletePost,
  stopBoardPost,
} from "../api/service";
import {
  awardWealth,
  deductWealth,
} from "@modules/reaction";

const FormItem = Form.Item;
const Option = Select.Option;

interface PostManagementDialogProps {
  update;
  privilege;
  item;
  boardId;
  d_wealth;
  m_wealth;
  boardName;
  visible;
  onCancel;
}

export function PostManagementDialog(props: PostManagementDialogProps) {
  const formRef = React.useRef<FormInstance>(null);
  const [option, setOption] = React.useState("");
  const [current, setCurrent] = React.useState("wealth");

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setOption(value);
  };

  const handleClick = (event) => {
    console.log("click ", event);
    setCurrent(event.key);
  };

  const onCreate = async () => {
    console.log(current);
    let value = 0;
    let reason = "";
    let response = null;

    try {
      const values = await formRef.current!.validateFields();
      switch (current) {
        case "wealth":
          value = parseInt(values.wealth);
          reason = values.reason.toString();
          response = await awardWealth(reason, value, props.item.id);
          break;
        case "prestige":
          value = parseInt(values.prestige);
          reason = values.reason.toString();
          response = await addPrestige(props.item.id, value, reason);
          break;
        case "punishwealth":
          value = parseInt(values.wealth);
          reason = values.reason.toString();
          response = await deductWealth(reason, value, props.item.id);
          break;
        case "punishprestige":
          value = parseInt(values.prestige);
          reason = values.reason.toString();
          response = await deductPrestige(props.item.id, value, reason);
          break;
        case "delete":
          reason = values.reason.toString();
          response = await deletePost(
            props.item.topicId,
            props.item.id,
            reason
          );
          break;
        case "tp":
          reason = values.reason.toString();
          value = parseInt(values.days);
          response = await stopBoardPost(props.item.id, reason, value);
          break;
        case "canceltp":
          response = await cancelStopBoardPost(
            props.item.userId,
            props.boardId
          );
          break;
      }
      if (response === "ok") {
        props.update();
        props.onCancel();
      } else {
        alert(response);
      }
    } catch (_error) {
      return;
    }
  };

  console.log(props.item.id);
  const { visible, onCancel } = props;
  let rcForm = null;
  let maxWealth: any = 0;
  if (!props.m_wealth) maxWealth = "不限";
  else maxWealth = props.m_wealth;

  switch (current) {
    case "wealth":
      rcForm = (
        <Form layout="vertical" ref={formRef}>
          <Tag color="blue">
            您今天在{props.boardName}已经发了{props.d_wealth}
            财富值，最多可发{maxWealth} （单次最多1000）
          </Tag>
          <FormItem
            label="财富值"
            name="wealth"
            rules={[{ required: true, message: "请输入财富值" }]}
          >
            <InputNumber />
          </FormItem>

          <FormItem
            label="理由"
            name="reason"
            rules={[{ required: true, message: "请输入理由" }]}
          >
            <Select
              mode={"tags"}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="好文章">好文章</Option>
              <Option value="有用资源">有用资源</Option>
              <Option value="热心回复">热心回复</Option>
            </Select>
          </FormItem>
        </Form>
      );
      break;
    case "prestige":
      rcForm = (
        <Form layout="vertical" ref={formRef}>
          <FormItem
            label="威望"
            name="prestige"
            rules={[{ required: true, message: "请输入威望值" }]}
          >
            <InputNumber />
          </FormItem>
          <FormItem
            label="理由"
            name="reason"
            rules={[{ required: true, message: "请输入理由" }]}
          >
            <Select
              mode={"tags"}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="好文章">好文章</Option>
              <Option value="有用资源">有用资源</Option>
              <Option value="热心回复">热心回复</Option>
            </Select>
          </FormItem>
        </Form>
      );
      break;
    case "punishwealth":
      rcForm = (
        <Form layout="vertical" ref={formRef}>
          <FormItem
            label="财富值"
            name="wealth"
            rules={[{ required: true, message: "请输入财富值" }]}
          >
            <InputNumber />
          </FormItem>

          <FormItem
            label="理由"
            name="reason"
            rules={[{ required: true, message: "请输入理由" }]}
          >
            <Select
              mode={"tags"}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="人身攻击">人身攻击</Option>
              <Option value="违反版规">违反版规</Option>
              <Option value="恶意灌水">恶意灌水</Option>
            </Select>
          </FormItem>
        </Form>
      );
      break;
    case "punishprestige":
      rcForm = (
        <Form layout="vertical" ref={formRef}>
          <FormItem
            label="威望"
            name="prestige"
            rules={[{ required: true, message: "请输入威望值" }]}
          >
            <InputNumber />
          </FormItem>
          <FormItem
            label="理由"
            name="reason"
            rules={[{ required: true, message: "请输入理由" }]}
          >
            <Select
              mode={"tags"}
              defaultValue="人身攻击"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="人身攻击">人身攻击</Option>
              <Option value="违反版规">违反版规</Option>
              <Option value="恶意灌水">恶意灌水</Option>
            </Select>
          </FormItem>
        </Form>
      );
      break;
    case "delete":
      rcForm = (
        <Form layout="vertical" ref={formRef}>
          <FormItem
            label="理由"
            name="reason"
            rules={[{ required: true, message: "请输入理由" }]}
          >
            <Input />
          </FormItem>
        </Form>
      );
      break;
    case "canceltp":
      rcForm = (
        <Form ref={formRef}>
          <div>解除此用户版面 tp</div>
        </Form>
      );
      break;
    case "tp":
      rcForm = (
        <Form layout="vertical" ref={formRef}>
          <FormItem
            label="天数"
            name="days"
            rules={[{ required: true, message: "请输入tp天数" }]}
          >
            <InputNumber />
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
      break;
  }

  return (
    <Modal
      open={visible}
      title="发言管理"
      okText="确认"
      cancelText="取消"
      onOk={onCreate}
      onCancel={onCancel}
      width={"50rem"}
    >
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        style={{ marginBottom: "2rem" }}
      >
        <Menu.Item key="wealth">奖励财富值</Menu.Item>
        <Menu.Item key="prestige">奖励威望</Menu.Item>
        <Menu.Item key="punishwealth">扣除财富值</Menu.Item>
        <Menu.Item key="punishprestige">扣除威望</Menu.Item>
        <Menu.Item key="delete">删除</Menu.Item>
        <Menu.Item key="tp">TP</Menu.Item>
        <Menu.Item key="canceltp">解除TP</Menu.Item>
      </Menu>
      {rcForm}
    </Modal>
  );
}
