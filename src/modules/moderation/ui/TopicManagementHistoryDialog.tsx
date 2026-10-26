import * as React from "react";
import { Dialog } from "@foundation/ui/dialog";
import { List } from "@foundation/ui/list";
import moment from "moment";
import { getManageHistory } from "../api/service";
import type { BoardEvent } from "@modules/board/model/dto";
import type { TopicInfo } from "@modules/topic/model/dto";
import type { TopicManageHistory } from "../model/dto";

import styles from "./TopicManagementHistoryDialog.module.scss";

interface TopicManagementHistoryDialogProps {
  visible: boolean;
  topicInfo: TopicInfo;
  onClose: () => void;
}

export function TopicManagementHistoryDialog(
  props: TopicManagementHistoryDialogProps
) {
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
    <Dialog
      open={props.visible}
      title="管理记录"
      confirmText="确 认"
      cancelText="取 消"
      onOpenChange={(open) => {
        if (!open) onClick();
      }}
      width="50rem"
      maskClosable={false}
      bodyClassName={styles.dialogBody}
    >
      {data && (
        <List
          dataSource={(data.data ?? []) as BoardEvent[]}
          loading={loading}
          pagination={
            data.count > 7
              ? {
                  pageSize: 7,
                  total: data.count,
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
                }
              : false
          }
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={item.content}
                description={
                  <div>
                    <span>对象:{item.targetUserName || "匿名"}</span>
                    <span className={styles.recordTime}>
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
        />
      )}
    </Dialog>
  );
}
