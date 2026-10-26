import * as React from "react";

import { Button } from "@foundation/ui/button";
import { Dialog } from "@foundation/ui/dialog";
import { notification } from "@foundation/ui/feedback";
import {
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@foundation/ui/icon";
import { Select } from "@foundation/ui/select";
import { TagsInput } from "@foundation/ui/tags-input";
import { TransferList } from "@foundation/ui/transfer-list";
import type { BoardInfo } from "@modules/board/model/types";
import {
  multiDelete,
  multiLock,
} from "@modules/moderation/api/service";
import type { TopicInfo } from "@modules/topic/model/dto";

import styles from "./BoardBatchManager.module.scss";

export interface BoardBatchOperations {
  multiDelete: (topicIds: number[], reason: string) => Promise<Response>;
  multiLock: (
    topicIds: number[],
    reason: string,
    value: number,
  ) => Promise<Response>;
}

interface BoardBatchManagerProps {
  data: BoardInfo;
  list: TopicInfo[];
  visible: boolean;
  onClose: () => void;
  operations?: BoardBatchOperations;
}

type BatchChild = "delete" | "lock";

const defaultOperations: BoardBatchOperations = {
  multiDelete,
  multiLock,
};

const reasonOptions = [
  "重复发帖",
  "管理要求",
  "已解决",
  "内容不符",
  "违反版规",
];

const dayOptions = [7, 30, 98, 1000].map((value) => ({
  value,
  label: value,
}));

export function BoardBatchManager({
  data: _data,
  list,
  visible,
  onClose,
  operations = defaultOperations,
}: BoardBatchManagerProps) {
  const [targetIds, setTargetIds] = React.useState<number[]>([]);
  const [sourceSelectedIds, setSourceSelectedIds] = React.useState<number[]>([]);
  const [targetSelectedIds, setTargetSelectedIds] = React.useState<number[]>([]);
  const [activeChild, setActiveChild] = React.useState<BatchChild | null>(null);
  const [deleteReasons, setDeleteReasons] = React.useState<string[]>([]);
  const [lockReasons, setLockReasons] = React.useState<string[]>([]);
  const [days, setDays] = React.useState(7);
  const [submitting, setSubmitting] = React.useState<BatchChild | null>(null);

  const targetIdSet = new Set(targetIds);
  const sourceItems = list.filter((item) => !targetIdSet.has(item.id));
  const topicById = new Map(list.map((item) => [item.id, item]));
  const targetItems = targetIds
    .map((id) => topicById.get(id))
    .filter((item): item is TopicInfo => item !== undefined);

  const openNotification = () => {
    notification.open({
      message: "操作错误",
      description: "请至少选择一个帖子",
      duration: 4.5,
      icon: <CloseCircleOutlined label="error" />,
    });
  };

  const moveToTarget = () => {
    const selectedSet = new Set(sourceSelectedIds);
    const movingIds = sourceItems
      .filter((item) => selectedSet.has(item.id))
      .map((item) => item.id);
    setTargetIds((currentIds) => [...currentIds, ...movingIds]);
    setSourceSelectedIds([]);
  };

  const moveToSource = () => {
    const selectedSet = new Set(targetSelectedIds);
    setTargetIds((currentIds) =>
      currentIds.filter((id) => !selectedSet.has(id)),
    );
    setTargetSelectedIds([]);
  };

  const submit = async (child: BatchChild) => {
    if (submitting !== null) return;

    const currentTargetIds = targetItems.map((item) => item.id);
    if (currentTargetIds.length === 0) {
      openNotification();
      return;
    }

    setSubmitting(child);
    const childReasons = child === "delete" ? deleteReasons : lockReasons;
    const currentReason = childReasons.at(-1) ?? "";
    try {
      const response =
        child === "delete"
          ? await operations.multiDelete(currentTargetIds, currentReason)
          : await operations.multiLock(currentTargetIds, currentReason, days);
      if (response.ok) {
        setActiveChild((current) => (current === child ? null : current));
      }
    } catch (_error) {
      // Rejected mutations intentionally leave the current dialog open.
    } finally {
      setSubmitting((current) => (current === child ? null : current));
    }
  };

  const requestCloseMain = () => {
    if (submitting === null) onClose();
  };

  const requestOpenChild = (child: BatchChild) => {
    if (submitting === null) setActiveChild(child);
  };

  const requestCloseChild = (child: BatchChild) => {
    if (submitting !== null) return;
    setActiveChild((current) => (current === child ? null : current));
  };

  return (
    <Dialog
      open={visible}
      title="批量管理"
      onOpenChange={(open) => {
        if (!open) requestCloseMain();
      }}
      maskClosable={false}
      width="50rem"
      className={styles.mainDialog}
      bodyClassName={styles.mainBody}
      classNames={{
        content: styles.mainContent,
        footer: styles.dialogFooter,
      }}
      footer={
        <div className={styles.footerActions}>
          <Button
            className={styles.footerButton}
            disabled={submitting !== null}
            onClick={requestCloseMain}
          >
            取消
          </Button>
          <Button
            type="primary"
            className={styles.footerButton}
            disabled={submitting !== null}
            onClick={() => requestOpenChild("lock")}
          >
            锁沉
          </Button>
          <Button
            type="primary"
            className={styles.footerButton}
            disabled={submitting !== null}
            onClick={() => requestOpenChild("delete")}
          >
            删除
          </Button>
        </div>
      }
    >
      <div
        className={styles.manager}
        data-board-batch-target-ids={JSON.stringify(targetIds)}
        data-board-batch-visible-target-ids={JSON.stringify(
          targetItems.map((item) => item.id),
        )}
        data-board-batch-active-child={activeChild ?? "none"}
        data-board-batch-submitting={submitting ?? "none"}
        data-board-batch-delete-reasons={JSON.stringify(deleteReasons)}
        data-board-batch-lock-reasons={JSON.stringify(lockReasons)}
      >
        <div className={styles.transfer} data-board-batch-transfer>
          <TransferList<TopicInfo, number>
            title="Source"
            items={sourceItems}
            getItemKey={(item) => item.id}
            renderItem={(item) => item.title}
            selectedKeys={sourceSelectedIds}
            onSelectedKeysChange={setSourceSelectedIds}
            ariaLabel="全选 Source"
            data-board-batch-list="source"
          />
          <div className={styles.operations}>
            <Button
              type="primary"
              size="small"
              className={styles.operationButton}
              disabled={sourceSelectedIds.length === 0}
              aria-label="移至 Target"
              onClick={moveToTarget}
            >
              <RightOutlined />
            </Button>
            <Button
              type="primary"
              size="small"
              className={styles.operationButton}
              disabled={targetSelectedIds.length === 0}
              aria-label="移至 Source"
              onClick={moveToSource}
            >
              <LeftOutlined />
            </Button>
          </div>
          <TransferList<TopicInfo, number>
            title="Target"
            items={targetItems}
            getItemKey={(item) => item.id}
            renderItem={(item) => item.title}
            selectedKeys={targetSelectedIds}
            onSelectedKeysChange={setTargetSelectedIds}
            ariaLabel="全选 Target"
            data-board-batch-list="target"
          />
        </div>

        <Dialog
          open={activeChild === "delete"}
          title="批量删除"
          onOpenChange={(open) => {
            if (!open) requestCloseChild("delete");
          }}
          onConfirm={() => submit("delete")}
          confirmLoading={submitting === "delete"}
          cancelText="取 消"
          width={520}
          className={styles.childDialog}
          bodyClassName={styles.deleteBody}
          classNames={{
            content: styles.deleteContent,
            footer: styles.dialogFooter,
            cancel: styles.childFooterButton,
            confirm: styles.childFooterButton,
          }}
        >
          <div className={styles.fieldLabel}>理由</div>
          <TagsInput
            className={styles.reasonInput}
            classNames={{
              control: styles.reasonControl,
              chips: styles.reasonChips,
              chip: styles.reasonChip,
              input: styles.reasonSearch,
              popup: styles.reasonPopup,
              item: styles.reasonItem,
            }}
            value={deleteReasons}
            onValueChange={setDeleteReasons}
            options={reasonOptions}
            ariaLabel="批量删除理由"
          />
        </Dialog>

        <Dialog
          open={activeChild === "lock"}
          title="批量锁沉"
          onOpenChange={(open) => {
            if (!open) requestCloseChild("lock");
          }}
          onConfirm={() => submit("lock")}
          confirmLoading={submitting === "lock"}
          cancelText="取 消"
          width={520}
          className={styles.childDialog}
          bodyClassName={styles.lockBody}
          classNames={{
            content: styles.lockContent,
            footer: styles.dialogFooter,
            cancel: styles.childFooterButton,
            confirm: styles.childFooterButton,
          }}
        >
          <div className={styles.fieldLabel}>理由</div>
          <TagsInput
            className={styles.reasonInput}
            classNames={{
              control: styles.reasonControl,
              chips: styles.reasonChips,
              chip: styles.reasonChip,
              input: styles.reasonSearch,
              popup: styles.reasonPopup,
              item: styles.reasonItem,
            }}
            value={lockReasons}
            onValueChange={setLockReasons}
            options={reasonOptions}
            ariaLabel="批量锁沉理由"
          />
          <div className={styles.fieldLabel}>天数</div>
          <Select<number>
            className={styles.daysSelect}
            classNames={{
              trigger: styles.daysTrigger,
              positioner: styles.daysPositioner,
              popup: styles.daysPopup,
              item: styles.daysItem,
            }}
            value={days}
            onValueChange={(nextValue) => {
              if (nextValue !== null) setDays(nextValue);
            }}
            options={dayOptions}
            ariaLabel="锁沉天数"
          />
        </Dialog>
      </div>
    </Dialog>
  );
}
