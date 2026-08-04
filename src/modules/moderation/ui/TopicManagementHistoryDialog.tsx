import * as React from "react";
import { List, Modal, Spin } from "antd";
import moment from "moment";
import { getManageHistory } from "../api/service";
import type { BoardEvent } from "@modules/board/model/dto";
import type { TopicInfo } from "@modules/topic/model/dto";
import type { TopicManageHistory } from "../model/dto";

interface TopicManagementHistoryDialogProps {
  visible: boolean;
  topicInfo: TopicInfo;
  onClose: () => void;
}

export function TopicManagementHistoryDialog(
  props: TopicManagementHistoryDialogProps
) {
  const [visible] = React.useState(true);
  const [data, setData] = React.useState<TopicManageHistory | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onClick = () => props.onClose();

  React.useEffect(() => {
    const loadFirstPage = async () => {
      setLoading(true);
      const response = await getManageHistory(props.topicInfo.id, 0);
      setData(response);
      setLoading(false);
    };

    loadFirstPage();
  }, []);

  return (
    <>
      <Modal
        open={visible}
        title="管理记录"
        okText="确认"
        cancelText="取消"
        onOk={onClick}
        onCancel={onClick}
        width={"50rem"}
        maskClosable={false}
        bodyStyle={{ maxHeight: "20rem", overflowY: "auto" }}
      >
        {data && (
          <List
            dataSource={data ? data.data ?? [] : []}
            pagination={{
              onChange: async (page) => {
                setLoading(true);
                const from = (page - 1) * 7;
                const response = await getManageHistory(
                  props.topicInfo.id,
                  from
                );
                setData(response);
                setLoading(false);
              },
              pageSize: 7,
              total: data.count,
            }}
            renderItem={(item: BoardEvent) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={item.content}
                  description={
                    <div>
                      <span>对象:{item.targetUserName || "匿名"}</span>
                      <span
                        style={{ marginLeft: "2rem", marginRight: "2rem" }}
                      >
                        时间:
                        {moment(item.time).format("YYYY-MM-DD HH:mm:ss")}
                      </span>
                    </div>
                  }
                />
                <div>
                  {" "}
                  <div>操作人:{item.operatorUserName}</div>
                  <div>IP:{item.ip}</div>
                </div>
              </List.Item>
            )}
          >
            {loading && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        )}
      </Modal>
    </>
  );
}
