import * as React from "react";
import moment from "moment";

import { getTpUsers } from "@modules/board/api/service";
import type { BoardStopPostUserInfo } from "@modules/board/model/dto";
import { cancelStopBoardPost } from "@modules/moderation/api/service";
import { Button } from "@foundation/ui/button";
import { List } from "@foundation/ui/list";

import styles from "./BoardHousingList.module.scss";

interface BoardHousingListProps {
  boardId: number;
  canManage: boolean;
}

const PAGE_SIZE = 5;

export function BoardHousingList({
  boardId,
  canManage,
}: BoardHousingListProps) {
  const [items, setItems] = React.useState<BoardStopPostUserInfo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);

  const loadPage = React.useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const from = (page - 1) * PAGE_SIZE;
        const result = await getTpUsers(boardId, from, PAGE_SIZE);
        const nextItems = result.data ?? [];

        setCurrentPage(page);
        setItems(nextItems);
        setTotal(result.count);
      } finally {
        setLoading(false);
      }
    },
    [boardId],
  );

  React.useEffect(() => {
    void loadPage(1);
  }, [loadPage]);

  const cancelTp = async (item: BoardStopPostUserInfo) => {
    const response = await cancelStopBoardPost(item.userId, boardId);
    if (response === "ok") {
      await loadPage(1);
    } else {
      alert(`操作失败,原因：${response}`);
    }
  };

  const pagination =
    items.length === 0
      ? false
      : {
          simple: true,
          current: currentPage,
          pageSize: PAGE_SIZE,
          total,
          onChange: loadPage,
        };

  return (
    <List
      dataSource={items}
      loading={loading}
      pagination={pagination}
      renderItem={(item) => (
        <List.Item key={`${item.userId}-${item.expiredTime}`}>
          <List.Item.Meta
            title={
              item.userName ? (
                <a target="_blank" href={`/user/id/${item.userId}`}>
                  {item.userName}
                </a>
              ) : (
                <div>匿名</div>
              )
            }
            description={
              <div>
                <span>天数:{item.days}</span>
                <span className={styles.tpTime}>
                  到期时间:
                  {moment(item.expiredTime).format("YYYY-MM-DD HH:mm:ss")}
                </span>
                <Button
                  onClick={() => cancelTp(item)}
                  type="primary"
                  className={canManage ? undefined : styles.hidden}
                >
                  解除tp
                </Button>
              </div>
            }
          />
          <div>操作人:{item.operatorUserName}</div>
        </List.Item>
      )}
    />
  );
}
