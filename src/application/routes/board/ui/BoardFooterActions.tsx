import * as React from "react";

import { isMaster } from "@modules/board/api/service";
import type { BoardInfo } from "@modules/board/model/types";
import type { TopicInfo } from "@modules/topic/model/dto";
import { Button } from "@foundation/ui/button";
import { Dialog } from "@foundation/ui/dialog";

import { BoardBatchManager } from "./BoardBatchManager";
import { BoardHousingList } from "./BoardHousingList";
import { BoardModerationRecordList } from "./BoardModerationRecordList";
import styles from "./BoardFooterActions.module.scss";

export { BoardBatchManager } from "./BoardBatchManager";
export { BoardHousingList } from "./BoardHousingList";
export { BoardModerationRecordList } from "./BoardModerationRecordList";

interface BoardFooterActionsProps {
  data: BoardInfo;
  list: TopicInfo[];
}

export function BoardFooterActions({
  data,
  list,
}: BoardFooterActionsProps) {
  const [housingVisible, setHousingVisible] = React.useState(false);
  const [manageVisible, setManageVisible] = React.useState(false);
  const [recordVisible, setRecordVisible] = React.useState(false);
  const boardMaster = isMaster(data.boardMasters);

  return (
    <>
      <div className={styles.footerActions}>
        <Button onClick={() => setRecordVisible(true)}>查看版面事件</Button>
        <Button onClick={() => setHousingVisible(true)}>小黑屋</Button>
        {boardMaster && (
          <Button onClick={() => setManageVisible(true)}>批量管理</Button>
        )}
      </div>

      <BoardBatchManager
        key={manageVisible.toString()}
        data={data}
        list={list}
        visible={manageVisible}
        onClose={() => setManageVisible(false)}
      />
      <Dialog
        title="小黑屋"
        open={housingVisible}
        onConfirm={() => setHousingVisible(false)}
        onOpenChange={setHousingVisible}
        cancelText="取 消"
        preserveOnClose
        width="60rem"
      >
        {housingVisible && (
          <BoardHousingList boardId={data.id} canManage={boardMaster} />
        )}
      </Dialog>
      <Dialog
        title="版面事件"
        open={recordVisible}
        onConfirm={() => setRecordVisible(false)}
        onOpenChange={setRecordVisible}
        cancelText="取 消"
        preserveOnClose
        width="60rem"
      >
        <BoardModerationRecordList id={data.id.toString()} />
      </Dialog>
    </>
  );
}
