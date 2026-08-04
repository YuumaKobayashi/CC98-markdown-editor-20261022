import * as React from "react";
import { Form, Menu, Modal, Select, Tag } from "antd";
import type { FormInstance } from "antd";
import { RatingType } from "@modules/post/model/enums";
import {
  getJudgeTags,
  negativeJudge,
  positiveJudge,
} from "../api/service";
import type { RatingReason } from "../model/types";

const FormItem = Form.Item;
const Option = Select.Option;
const Item = Menu.Item;

interface PostRatingDialogProps {
  visible;
  onCancel;
  item;
  update;
}

//TODO : Hard code here

export function PostRatingDialog(props: PostRatingDialogProps) {
  const formRef = React.useRef<FormInstance>(null);
  const [current, setCurrent] = React.useState("0");
  const [option, setOption] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [positiveTags, setPositiveTags] = React.useState<RatingReason[]>([]);
  const [negativeTags, setNegativeTags] = React.useState<RatingReason[]>([]);

  const handleChange = (value) => {
    console.log(value);
    setOption(value);
  };

  const onCreate = async () => {
    let status = "";
    let value = 0;
    try {
      const values = await formRef.current!.validateFields();
      setLoading(true);
      value = values.reason;
      console.log(value, current);
      switch (current) {
        case "1":
          status = await positiveJudge(props.item.id, value, RatingType.Add);
          break;
        case "2":
          status = await negativeJudge(props.item.id, value, RatingType.Subtract);
          break;
        case "0":
          alert("请选择加风评还是扣风评。");
          break;
      }
      setLoading(false);
      // debugger;
      if (status === "ok") {
        props.update();
        props.onCancel();
      } else {
        switch (status) {
          case "post_data_error":
            alert("提交数据类型错误");
            break;
          case "cannot_rate_yourself":
            alert("您不能给自己评分哦~");
            break;
          case "post_more_than_7_days":
            alert("超过7天的发言内容无法评分");
            break;
          case "you_cannot_rate":
            alert("您还没有资格评分~");
            break;
          case "board_cannot_rate":
            alert("该版面无法评分");
            break;
          case "has_rated_today":
            alert("您今天已经评分过了~");
            break;
          case "has_rated_this_post":
            alert("您已对当前发言进行过评分操作~");
            break;
          case "post_not_exists":
            alert("发言不存在");
            break;
          case "topic_not_exists":
            alert("主题不存在");
            break;
          case "post_user_not_exists":
            alert("发言用户不存在");
            break;
          default:
            alert("未知错误");
            break;
        }
      }
    } catch (_error) {
      return;
    }
  };

  const handleClick = (event) => {
    // 控制加分 or 扣分选项卡。
    console.log("click ", event);
    // 如果是加分选项卡，且加分理由未获取，则获取加分理由。
    if (event.key === "1" && positiveTags.length === 0) {
      getJudgeTags(RatingType.Add).then((response) => {
        setPositiveTags(response);
      });
    }
    // 如果是扣分选项卡，且扣分理由未获取，则获取扣分理由。
    if (event.key === "2" && negativeTags.length === 0) {
      getJudgeTags(RatingType.Subtract).then((response) => {
        setNegativeTags(response);
      });
    }

    // 清空已选择的理由。
    setOption("");
    // 清空表单选中项。
    if (formRef.current) formRef.current.resetFields();
    setCurrent(event.key);
  };

  const positiveForm = (
    <Form key="positiveForm" ref={formRef}>
      <FormItem
        label="理由"
        name="reason"
        rules={[{ required: true, message: "请选择理由" }]}
      >
        <Select
          style={{ width: 200 }}
          onChange={handleChange}
          key="positiveForm-Select"
        >
          {positiveTags.map(
            (tag) =>
              tag.enabled && (
                <Option value={tag.id} key={tag.id}>
                  {tag.reason}
                </Option>
              )
          )}
        </Select>
      </FormItem>
    </Form>
  );

  const negativeForm = (
    <Form key="negativeForm" ref={formRef}>
      <FormItem
        label="理由"
        name="reason"
        rules={[{ required: true, message: "请选择理由" }]}
      >
        <Select
          style={{ width: 200 }}
          onChange={handleChange}
          key="nagativeForm-Select"
        >
          {negativeTags.map(
            (tag) =>
              tag.enabled && (
                <Option value={tag.id} key={tag.id}>
                  {tag.reason}
                </Option>
              )
          )}
        </Select>
      </FormItem>
    </Form>
  );

  const disabledForm = (
    <Form ref={formRef}>
      <FormItem
        label="理由"
        name="reason"
        rules={[{ required: true, message: "请选择理由" }]}
      >
        <Select style={{ width: 200 }} disabled={true}></Select>
      </FormItem>
      <div>提示：请先点击“+1”或者“-1”，再选择理由。</div>
    </Form>
  );

  return (
    <Modal
      open={props.visible}
      title="评分"
      okText="确认"
      cancelText="取消"
      onOk={onCreate}
      onCancel={props.onCancel}
      confirmLoading={loading}
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
          <img
            style={{ width: "2rem" }}
            src="/static/images/j-plus1.png"
          ></img>
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              fontSize: "16px",
            }}
          >
            +1
          </span>
        </Item>
        <Item disabled>|</Item>
        <Item key="2">
          <img
            style={{ width: "2rem" }}
            src="/static/images/j-minus1.png"
          ></img>
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              fontSize: "16px",
            }}
          >
            -1
          </span>
        </Item>
      </Menu>
      <Tag color="blue">
        500帖以上的用户可以进行评分（每日一次），超过7天的发言内容无法评分。
      </Tag>
      {/* {rcForm} */}
      {current === "1" ? positiveForm : null}
      {current === "2" ? negativeForm : null}
      {current === "0" ? disabledForm : null}
    </Modal>
  );
}
