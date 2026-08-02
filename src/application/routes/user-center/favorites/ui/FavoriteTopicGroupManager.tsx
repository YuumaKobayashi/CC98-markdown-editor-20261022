import * as React from "react";
import { Button, Form, Input, Menu, Modal, Select } from "antd";
import type { FormInstance } from "antd";

import {
  createFavGroup,
  deleteFavGroup,
  type FavoriteTopicGroup,
  updateFavGroup,
} from "@modules/favorite-topic";
import {
  NoticeMessage,
  noticeMessageShow,
} from "@foundation/ui/feedback";

const Item = Menu.Item;
const FormItem = Form.Item;
const { Option } = Select;

enum Options {
  Default = "0",
  Create = "1",
  Rename = "2",
  Delete = "3",
}

type FavoriteTopicGroupManagerProps = {
  updateFavoriteTopicList: () => Promise<void>;
  favoriteTopicList: FavoriteTopicGroup[];
};

export function FavoriteTopicGroupManager({
  favoriteTopicList,
  updateFavoriteTopicList,
}: FavoriteTopicGroupManagerProps) {
  const formRef = React.useRef<FormInstance>(null);
  const [visible, setVisible] = React.useState(false);
  const [option, setOption] = React.useState(Options.Create);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  // favoriteTopicList: defaultFavoriteTopicGroup,

  const handleMenuClick = (event: { key: string }) => {
    setOption(event.key as Options);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await formRef.current!.validateFields();
      setConfirmLoading(true);
      switch (option) {
        case Options.Create: {
          console.log(values);
          const createResult = await createFavGroup(values.createName);
          if (createResult !== "ok") {
            noticeMessageShow("maxFavGroup");
            setConfirmLoading(false);
            return false;
          }
          break;
        }
        case Options.Rename: {
          console.log(values);
          const renameResult = await updateFavGroup(
            values.renameId,
            values.rename
          );
          if (renameResult !== "ok") {
            noticeMessageShow("other");
            setConfirmLoading(false);
            return false;
          }
          break;
        }
        case Options.Delete: {
          console.log(values);
          const deleteResult = await deleteFavGroup(values.deleteId);
          if (deleteResult !== "ok") {
            noticeMessageShow("other");
            setConfirmLoading(false);
            return false;
          }
          break;
        }
        default:
          break;
      }
      console.log(values);
      noticeMessageShow("success");
      await updateFavoriteTopicList();
      setVisible(false);
      setConfirmLoading(false);
    } catch (_error) {
      return false;
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const options = favoriteTopicList.map((item) =>
    item.id === 0 ? null : (
      <Option key={item.id} value={item.id}>
        {item.name + " (" + item.count + ")"}
      </Option>
    )
  );
  const isFavoriteTopicListMax = favoriteTopicList.length - 1 === 10;
  const emptyForm = (
    <Form ref={formRef}>
      <div>没有可供操作的收藏组</div>
      <div>默认分组不可删除或重命名</div>
    </Form>
  );
  const createForm = (
    <Form ref={formRef}>
      <FormItem
        label="分组名称"
        name="createName"
        extra={`目前支持的分组上限为10个，你已经创建了${
          favoriteTopicList.length - 1
        }个分组`}
        rules={[
          {
            required: option === Options.Create,
            max: 10,
            message: "请输入最多十个字符且不为空的名称",
          },
        ]}
      >
        <Input disabled={isFavoriteTopicListMax} />
      </FormItem>
    </Form>
  );
  const renameForm =
    favoriteTopicList.length === 1 ? (
      emptyForm
    ) : (
      <Form ref={formRef}>
        <FormItem
          label="分组名称"
          name="renameId"
          rules={[
            {
              required: option === Options.Rename,
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
              required: option === Options.Rename,
              max: 10,
              message: "请输入最多十个字符且不为空的名称",
            },
          ]}
        >
          <Input />
        </FormItem>
      </Form>
    );
  const deleteForm =
    favoriteTopicList.length === 1 ? (
      emptyForm
    ) : (
      <Form ref={formRef}>
        <FormItem
          label="分组名称"
          name="deleteId"
          rules={[
            {
              required: option === Options.Delete,
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

  let optionForm: React.ReactNode = null;
  switch (option) {
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
      <Button type="primary" style={{ width: 80 }} onClick={showModal}>
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
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        key="FavoriteTopicManageModal"
        destroyOnClose={true}
      >
        <div style={{ height: "250px" }}>
          <Menu
            onClick={handleMenuClick}
            selectedKeys={[option + ""]}
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

export default FavoriteTopicGroupManager;
