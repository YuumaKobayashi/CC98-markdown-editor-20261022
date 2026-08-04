import * as React from "react";
import { List, Spin } from "antd";
import moment from "moment";
import { getBoardRecords } from "@modules/moderation/api/service";


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
