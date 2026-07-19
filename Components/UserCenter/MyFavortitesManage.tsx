import { Button, Form, FormInstance, Input, Menu, Modal, Select, Tabs, message } from "antd";
import * as React from "react";
import {
  createFavGroup,
  deleteFavGroup,
  getFavoriteAllTopic,
  noticeMessageShow,
  updateFavGroup,
} from "../../Utility";
import { type } from "os";
const Item = Menu.Item;
const FormItem = Form.Item;
type FavoriteTopicGroupType = {
  count: number;
  createTime: string;
  id: number;
  name: string;
};
const { Option } = Select;
const defaultFavoriteTopicGroup: FavoriteTopicGroupType[] = [
  {
    id: 0,
    name: "默认分组",
    count: 10,
    createTime: "1998-09-08T09:08:00+08:00",
  },
];
enum Options {
  Default = "0",
  Create = "1",
  Rename = "2",
  Delete = "3",
}
import type { LegacyHistory } from "@app/router/legacy-route-props";
import { NoticeMessage } from "../NoticeMessage";
type Props = {
  history: LegacyHistory;
  updateFavoriteTopicList: () => Promise<void>;
  favoriteTopicList: FavoriteTopicGroupType[];
};
export default class MyFavoritesPostsManager extends React.Component<Props> {
    private formRef = React.createRef<FormInstance>();
    state = {
      visible: false,
      option: Options.Create,
      confirmLoading: false,
      // favoriteTopicList: defaultFavoriteTopicGroup,
    };

    async componentDidMount() {
    }
    handleMenuClick = (e: { key: any }) => {
      this.setState({
        option: e.key,
      });
    };

    showModal = () => {
      this.setState({
        visible: true,
      });
    };

    handleOk = async (e: any) => {
      try {
        const values = await this.formRef.current.validateFields();
        this.setState({
          confirmLoading: true,
        });
        switch (this.state.option) {
          case Options.Create:
            console.log(values);
            let createRes = await createFavGroup(
              values.createName
            );
            if (createRes !== "ok") {
              noticeMessageShow("maxFavGroup");
              this.setState({ confirmLoading: false })
              return false;
            }
            break;
          case Options.Rename:
            console.log(values);
            let renameRes = await updateFavGroup(
              values.renameId,
              values.rename
            );
            if (renameRes !== "ok") {
              noticeMessageShow("other");
              this.setState({ confirmLoading: false })
              return false;
            }
            break;
          case Options.Delete:
            console.log(values);
            let deleteRes = await deleteFavGroup(
              values.deleteId
            );
            if (deleteRes !== "ok") {
              noticeMessageShow("other");
              this.setState({ confirmLoading: false })
              return false;
            }
            break;
          default:
            break;
        }
        console.log(values);
        noticeMessageShow("success");
        await this.props.updateFavoriteTopicList();
        this.setState({
          visible: false,
          confirmLoading: false,
        });
      } catch (_error) {
        return false;
      }
    };

    handleCancel = () => {
      console.log("Clicked cancel button");
      this.setState({
        visible: false,
      });
    };
    render() {
      const { visible, confirmLoading } = this.state;
      const options = this.props.favoriteTopicList.map((item) =>
        item.id === 0 ? null : (
          <Option key={item.id} value={item.id}>
            {item.name + " (" + item.count + ")"}
          </Option>
        )
      );
      const isFavoriteTopicListMax =
        this.props.favoriteTopicList.length - 1 === 10;
      let EmptyForm = (
        <Form ref={this.formRef}>
          <div>没有可供操作的收藏组</div>
          <div>默认分组不可删除或重命名</div>
        </Form>
      );
      let createForm = (
        <Form ref={this.formRef}>
          <FormItem
            label="分组名称"
            name="createName"
            extra={`目前支持的分组上限为10个，你已经创建了${
              this.props.favoriteTopicList.length - 1
            }个分组`}
            rules={[
              {
                required: this.state.option === Options.Create,
                max: 10,
                message: "请输入最多十个字符且不为空的名称",
              },
            ]}
          >
            <Input disabled={isFavoriteTopicListMax} />
          </FormItem>
        </Form>
      );

      let renameForm =
        this.props.favoriteTopicList.length === 1 ? (
          EmptyForm
        ) : (
          <Form ref={this.formRef}>
            <FormItem
              label="分组名称"
              name="renameId"
              rules={[
                {
                  required: this.state.option === Options.Rename,
                  message: "请选择需要更名的收藏组",
                },
              ]}
            >
              <Select>{options}</Select>
            </FormItem>
            <FormItem
              label="将名称修改为"
              name="rename"
              rules={[
                {
                  required: this.state.option === Options.Rename,
                  max: 10,
                  message: "请输入最多十个字符且不为空的名称",
                },
              ]}
            >
              <Input />
            </FormItem>
          </Form>
        );

      let deleteForm =
        this.props.favoriteTopicList.length === 1 ? (
          EmptyForm
        ) : (
          <Form ref={this.formRef}>
            <FormItem
              label="分组名称"
              name="deleteId"
              rules={[
                {
                  required: this.state.option === Options.Delete,
                  message: "请选择需要删除的收藏组",
                },
              ]}
            >
              <Select>{options}</Select>
            </FormItem>
            <div>
              注意：删除后该分组将无法恢复，该分组下的所有收藏主题帖将被移入【默认分组】
            </div>
          </Form>
        );

      let optionForm = null;
      switch (this.state.option) {
        case Options.Create:
          optionForm = createForm;
          break;
        case Options.Rename:
          optionForm = renameForm;
          break;
        case Options.Delete:
          optionForm = deleteForm;
          break;
        default:
          break;
      }

      return (
        <span>
          <Button type="primary" style={{ width: 80 }} onClick={this.showModal}>
            管理分组
          </Button>
          <NoticeMessage
            text="收藏分组达到上限"
            id="maxFavGroup"
            top="33%"
            left="40%"
          />
          <NoticeMessage text="操作成功" id="success" top="33%" left="40%" />
          <NoticeMessage text="操作失败" id="other" top="33%" left="40%" />
          <Modal
            title="收藏管理"
            open={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            key="FavoriteTopicManageModal"
            destroyOnClose={true}
          >
            <div style={{ height: "250px" }}>
              <Menu
                onClick={this.handleMenuClick}
                selectedKeys={[this.state.option + ""]}
                mode="horizontal"
                style={{
                  display: "flex",
                  marginBottom: "1rem",
                  justifyContent: "space-around",
                }}
              >
                <Item key="1">新增分组</Item>
                <Item key="2">编辑分组</Item>
                <Item key="3">删除分组</Item>
              </Menu>
              {optionForm}
            </div>
          </Modal>
        </span>
      );
    }
  }
