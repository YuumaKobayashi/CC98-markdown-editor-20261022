import * as React from "react";
import { Form, FormInstance, Menu, Modal, Select, Tag } from "antd";
import * as Utility from "../../Utility";
const FormItem = Form.Item;
const Option = Select.Option;
const Item = Menu.Item;
interface FormProps {
  visible;
  onCancel;
  item;
  update;
}
interface FormStates {
  current;
  option;
  loading;
}
export default class TopicJudgeV2 extends React.Component<FormProps, FormStates> {
    private formRef = React.createRef<FormInstance>();
    constructor(props) {
      super(props);
      this.state = { current: "0", option: "", loading: false };
    }
    handleChange = (value) => {
      this.setState({ option: value });
    };
    onCreate = async () => {
      let status = "",
        value = "";
      try {
        const values = await this.formRef.current.validateFields();
        this.setState({ loading: true });
        value = values.reason.toString();
        console.log(value, this.state.current);
        switch (this.state.current) {
          case "1":
            status = await Utility.plus1(
              this.props.item.topicId,
              this.props.item.id,
              value
            );
            break;
          case "2":
            status = await Utility.minus1(
              this.props.item.topicId,
              this.props.item.id,
              value
            );
            break;
          case "0":
            alert("请选择加风评还是扣风评。");
            break;
        }
        this.setState({ loading: false });
        if (status === "ok") {
          this.props.update();
          this.props.onCancel();
        } else {
          if (status === "already")
            alert("您今天已经评分过了，或者还未到500贴~");
          else if (status === "not allowed") alert("您还没有资格评分~");
          else if (status === "rateself") alert("您不能给自己评分哦~");
        }
      } catch (_error) {
        return;
      }
    };
    handleClick = (e) => {
      console.log("click ", e);
      this.setState({
        current: e.key,
      });
    };
    render() {
      const { visible, onCancel } = this.props;
      const p1Form = (
        <Form ref={this.formRef}>
          <FormItem
            label="理由"
            name="reason"
            rules={[{ required: true, message: "请输入理由" }]}
          >
            <Select
              mode={"tags"}
              style={{ width: 400 }}
              onChange={this.handleChange}
            >
              <Option value="所言极是">所言极是</Option>
              <Option value="好人一生平安">好人一生平安</Option>
              <Option value="非常求是">非常求是</Option>
            </Select>
          </FormItem>
        </Form>
      );
      const m1Form = (
        <Form ref={this.formRef}>
          <FormItem
            label="理由"
            name="reason"
            rules={[{ required: true, message: "请输入理由" }]}
          >
            <Select
              mode={"tags"}
              style={{ width: 400 }}
              onChange={this.handleChange}
            >
              <Option value="太不求是">太不求是</Option>
              <Option value="呵呵">呵呵</Option>
              <Option value="被你暴击">被你暴击</Option>
            </Select>
          </FormItem>
        </Form>
      );
      let rcForm = this.state.current === "1" ? p1Form : m1Form;
      return (
        <Modal
          open={visible}
          title="评分"
          okText="确认"
          cancelText="取消"
          onOk={this.onCreate}
          onCancel={onCancel}
          confirmLoading={this.state.loading}
        >
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
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
            500贴以上的用户可以进行评分（每日一次），超过7天的发言内容无法评分。
          </Tag>
          {rcForm}
        </Modal>
      );
    }
  }
