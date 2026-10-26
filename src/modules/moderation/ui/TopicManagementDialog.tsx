import * as React from "react";

import { getBoards } from "@modules/board/api/service";
import { clearInvalidBoardsInfoCache } from "@modules/board/cache/board-cache";
import type { BoardCategoryInfo } from "@modules/board/model/dto";
import { Button } from "@foundation/ui/button";
import { Checkbox, CheckboxGroup } from "@foundation/ui/checkbox";
import { ColorPicker } from "@foundation/ui/color-picker";
import { Dialog } from "@foundation/ui/dialog";
import { Field } from "@foundation/ui/field";
import { Input } from "@foundation/ui/input";
import { Select, type SelectOption } from "@foundation/ui/select";
import { Tabs, type TabItem } from "@foundation/ui/tabs";
import {
  TopicBestState,
  TopicState,
  TopicTopState,
} from "@modules/topic/model/dto";

import {
  addBoardTopTopic,
  cancelBestTopic,
  cancelDisableHot,
  deleteTopic,
  lockTopic,
  moveTopic,
  removeBoardTopTopic,
  setBestTopic,
  setDisableHot,
  setHighlight,
  unLockTopic,
  upTopic,
  type ModerationResult,
} from "../api/service";
import styles from "./TopicManagementDialog.module.scss";

export type TopicManagementAction =
  | "lock"
  | "hot"
  | "delete"
  | "move"
  | "bump"
  | "board-top"
  | "global-top"
  | "best"
  | "highlight";

type TopicManagementOperationResult = ModerationResult | "error";

export interface TopicManagementOperations {
  loadBoards: () => Promise<BoardCategoryInfo[]>;
  lockTopic: (
    topicId: number,
    boardId: number,
    reason: string,
    days: number,
  ) => Promise<TopicManagementOperationResult>;
  unLockTopic: (
    topicId: number,
    boardId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  setDisableHot: (
    topicId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  cancelDisableHot: (
    topicId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  deleteTopic: (
    topicId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  moveTopic: (
    topicId: number,
    boardId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  upTopic: (
    topicId: number,
    boardId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  addBoardTopTopic: (
    topicId: number,
    boardId: number,
    topState: TopicTopState,
    days: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  removeBoardTopTopic: (
    topicId: number,
    boardId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  setBestTopic: (
    topicId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  cancelBestTopic: (
    topicId: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  setHighlight: (
    topicId: number,
    isBold: boolean,
    isItalic: boolean,
    color: string,
    duration: number,
    reason: string,
  ) => Promise<TopicManagementOperationResult>;
  notifyFailure: (failure: unknown) => void;
}

export interface TopicManagementDialogProps {
  visible: boolean;
  onCancel: () => void;
  topicInfo: {
    id: number;
    state: TopicState;
    disableHot: boolean;
    topState: TopicTopState;
    bestState: TopicBestState;
  };
  update: () => void;
  boardId: number;
  /** Whether the caller opened the dialog in board-manager mode. */
  isManager: boolean;
  /** Topic-author operations granted by the caller. */
  permissions: string[];
  operations?: TopicManagementOperations;
  initialAction?: TopicManagementAction;
}

interface DialogDimensions {
  content: number;
  body: number;
}

type BoardLoadState = "loading" | "ready" | "empty" | "error";

const durationDayOptions: SelectOption<number>[] = [
  { value: 7, label: "7" },
  { value: 14, label: "14" },
  { value: 30, label: "30" },
  { value: 98, label: "98" },
  { value: 180, label: "180" },
  { value: 365, label: "365" },
  { value: 1000, label: "1000" },
  { value: 10000, label: "10000 (作为永久使用)" },
];

const lockDayOptions: SelectOption<number>[] = [
  { value: 0, label: "0" },
  ...durationDayOptions,
];

const highlightOptions = [
  { label: "加粗", value: "bold" },
  { label: "斜体", value: "italic" },
];

const defaultOperations: TopicManagementOperations = {
  loadBoards: async () => {
    clearInvalidBoardsInfoCache();
    return getBoards();
  },
  lockTopic,
  unLockTopic,
  setDisableHot,
  cancelDisableHot,
  deleteTopic,
  moveTopic,
  upTopic,
  addBoardTopTopic,
  removeBoardTopTopic,
  setBestTopic,
  cancelBestTopic,
  setHighlight,
  notifyFailure: () => window.alert("操作失败"),
};

function getDimensions(action: TopicManagementAction, hasDays: boolean) {
  if (action === "highlight") return { content: 911, body: 801 };
  if (action === "move") return { content: 390, body: 280 };
  if (hasDays) return { content: 430, body: 320 };
  return { content: 326, body: 216 };
}

export function TopicManagementDialog({
  visible,
  onCancel,
  topicInfo,
  update,
  boardId,
  isManager,
  permissions,
  operations = defaultOperations,
  initialAction = "lock",
}: TopicManagementDialogProps) {
  const instanceId = React.useId().replace(/:/g, "");
  const wasVisibleRef = React.useRef(false);
  const [current, setCurrent] =
    React.useState<TopicManagementAction>(initialAction);
  const [reason, setReason] = React.useState("");
  const [days, setDays] = React.useState(0);
  const [highlightStyles, setHighlightStyles] = React.useState<string[]>([]);
  const [color, setColor] = React.useState("#ffffff");
  const [validated, setValidated] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [boards, setBoards] = React.useState<BoardCategoryInfo[]>([]);
  const [boardLoadState, setBoardLoadState] =
    React.useState<BoardLoadState>("loading");
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [childBoardId, setChildBoardId] = React.useState<number | null>(null);

  const resetDraft = React.useCallback(() => {
    setCurrent(initialAction);
    setReason("");
    setDays(0);
    setHighlightStyles([]);
    setColor("#ffffff");
    setValidated(false);
    setSubmitting(false);
    setCategoryId(null);
    setChildBoardId(null);
  }, [initialAction]);

  React.useLayoutEffect(() => {
    if (visible && !wasVisibleRef.current) {
      resetDraft();
    }
    wasVisibleRef.current = visible;
  }, [resetDraft, visible]);

  React.useEffect(() => {
    if (!visible) return undefined;

    let active = true;
    setBoardLoadState("loading");
    setBoards([]);

    operations.loadBoards().then(
      (loadedBoards) => {
        if (!active) return;
        const firstCategory = loadedBoards[0] ?? null;
        const firstBoard =
          firstCategory?.boards.find((board) => board.id !== 182) ?? null;
        setBoards(loadedBoards);
        setCategoryId(firstCategory?.id ?? null);
        setChildBoardId(firstBoard?.id ?? null);
        setBoardLoadState(loadedBoards.length === 0 ? "empty" : "ready");
      },
      () => {
        if (!active) return;
        setBoards([]);
        setCategoryId(null);
        setChildBoardId(null);
        setBoardLoadState("error");
      },
    );

    return () => {
      active = false;
    };
  }, [operations, visible]);

  const selectedCategory =
    boards.find((category) => category.id === categoryId) ?? null;
  const categoryOptions = boards.map((category) => ({
    value: category.id,
    label: category.name,
  }));
  const childBoardOptions = (selectedCategory?.boards ?? [])
    .filter((board) => board.id !== 182)
    .map((board) => ({ value: board.id, label: board.name }));

  const isReverseLock = topicInfo.state === TopicState.Locked;
  const isReverseHot = topicInfo.disableHot;
  const isReverseBoardTop = topicInfo.topState === TopicTopState.BoardTop;
  const isReverseGlobalTop = topicInfo.topState === TopicTopState.AllTop;
  const isReverseBest = topicInfo.bestState === TopicBestState.Best;
  const actionHasDays = (action: TopicManagementAction) =>
    (action === "lock" && !isReverseLock) ||
    (action === "board-top" && !isReverseBoardTop) ||
    (action === "global-top" && !isReverseGlobalTop);
  const hasDays = actionHasDays(current);
  const dimensions: DialogDimensions = getDimensions(current, hasDays);

  const renderReasonField = (action: TopicManagementAction) => {
    const reasonError =
      validated && current === action && reason.length === 0
        ? "请输入理由"
        : undefined;
    const reasonId = `${instanceId}-${action}-reason`;
    const reasonErrorId = `${reasonId}-error`;

    return (
      <Field
        label="理由："
        controlId={reasonId}
        required
        error={reasonError}
        errorId={reasonErrorId}
        classNames={{
          root: styles.field,
          label: styles.label,
          error: styles.error,
        }}
      >
        <Input
          id={reasonId}
          className={styles.input}
          value={reason}
          disabled={submitting}
          status={reasonError ? "error" : undefined}
          aria-invalid={Boolean(reasonError)}
          aria-describedby={reasonError ? reasonErrorId : undefined}
          required
          onChange={(event) => setReason(event.target.value)}
          data-topic-management-reason={action}
        />
      </Field>
    );
  };

  const renderDaysField = (action: TopicManagementAction) => {
    const includesZero = action === "lock";
    const dayOptions = includesZero ? lockDayOptions : durationDayOptions;
    const displaysUnlistedZero = !includesZero && days === 0;

    return (
      <Field
        label="天数："
        errorId={`${instanceId}-${action}-days-error`}
        classNames={{
          root: styles.field,
          label: styles.label,
          error: styles.error,
        }}
      >
        <span
          className={styles.daySelectWrapper}
          data-topic-management-days-select={action}
          data-topic-management-days-value={days}
          data-topic-management-days-options={dayOptions
            .map((option) => option.value)
            .join(",")}
        >
          <Select<number>
            value={displaysUnlistedZero ? null : days}
            options={dayOptions}
            placeholder={displaysUnlistedZero ? "0" : undefined}
            disabled={submitting}
            ariaLabel="天数"
            className={styles.fullSelect}
            classNames={{
              trigger: `${styles.selectTrigger} ${styles.legacyDayTrigger}`,
              popup: styles.legacyDayPopup,
              item: styles.legacyDayItem,
            }}
            highlightFirstItemOnOpen={displaysUnlistedZero}
            onValueChange={(value) => {
              if (value !== null) setDays(value);
            }}
          />
        </span>
      </Field>
    );
  };

  const renderForm = (action: TopicManagementAction) => {
    if (action === "move") {
      const statusText =
        boardLoadState === "loading"
          ? "版面加载中"
          : boardLoadState === "error"
            ? "版面加载失败"
            : boardLoadState === "empty"
              ? "暂无可用版面"
              : childBoardOptions.length === 0
                ? "暂无可用子版面"
                : null;

      return (
        <div className={`${styles.form} ${styles.moveForm}`} data-topic-management-form={action}>
          {renderReasonField(action)}
          <div className={styles.boardRow}>
            <Select<number>
              value={categoryId}
              options={categoryOptions}
              disabled={submitting || boardLoadState !== "ready"}
              placeholder="版面"
              ariaLabel="版面分类"
              className={styles.boardSelect}
              classNames={{ trigger: styles.selectTrigger }}
              onValueChange={(value) => {
                setCategoryId(value);
                const category = boards.find((board) => board.id === value);
                setChildBoardId(
                  category?.boards.find((board) => board.id !== 182)?.id ?? null,
                );
              }}
              data-topic-management-category-select
            />
            <Select<number>
              value={childBoardId}
              options={childBoardOptions}
              disabled={
                submitting ||
                boardLoadState !== "ready" ||
                childBoardOptions.length === 0
              }
              placeholder="子版面"
              ariaLabel="目标子版面"
              className={styles.boardSelect}
              classNames={{ trigger: styles.selectTrigger }}
              onValueChange={setChildBoardId}
              data-topic-management-board-select
            />
            {statusText && (
              <span
                className={styles.boardStatus}
                role={boardLoadState === "error" ? "alert" : "status"}
                data-topic-management-board-status={boardLoadState}
              >
                {statusText}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (action === "highlight") {
      const allChecked = highlightStyles.length === highlightOptions.length;
      const indeterminate =
        highlightStyles.length > 0 && !allChecked;

      return (
        <div
          className={`${styles.form} ${styles.highlightForm}`}
          data-topic-management-form={action}
        >
          <div className={styles.checkboxRow}>
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              disabled={submitting}
              onChange={(event) =>
                setHighlightStyles(
                  event.target.checked ? ["bold", "italic"] : [],
                )
              }
              data-topic-management-check-all
            >
              Check all
            </Checkbox>
            <CheckboxGroup
              options={highlightOptions}
              value={highlightStyles}
              disabled={submitting}
              onChange={(values) =>
                setHighlightStyles(values.map((value) => String(value)))
              }
              data-topic-management-highlight-options
            />
          </div>
          {renderDaysField(action)}
          {renderReasonField(action)}
          <div className={styles.colorField}>
            <span className={styles.colorLabel}>颜色：</span>
            <ColorPicker
              value={color}
              onChange={setColor}
              disabled={submitting}
              data-topic-management-color-picker
            />
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${styles.form} ${actionHasDays(action) ? styles.daysForm : styles.reasonForm}`}
        data-topic-management-form={action}
      >
        {actionHasDays(action) && renderDaysField(action)}
        {renderReasonField(action)}
      </div>
    );
  };

  const onConfirm = async () => {
    if (submitting) return;
    if (reason.length === 0) {
      setValidated(true);
      return;
    }
    if (current === "move" && childBoardId === null) {
      operations.notifyFailure("error");
      return;
    }

    setSubmitting(true);
    let response: TopicManagementOperationResult;

    try {
      switch (current) {
        case "lock":
          response = isReverseLock
            ? await operations.unLockTopic(topicInfo.id, boardId, reason)
            : await operations.lockTopic(topicInfo.id, boardId, reason, days);
          break;
        case "hot":
          response = isReverseHot
            ? await operations.cancelDisableHot(topicInfo.id, reason)
            : await operations.setDisableHot(topicInfo.id, reason);
          break;
        case "delete":
          response = await operations.deleteTopic(topicInfo.id, reason);
          break;
        case "move":
          response = await operations.moveTopic(
            topicInfo.id,
            childBoardId as number,
            reason,
          );
          break;
        case "bump":
          response = await operations.upTopic(topicInfo.id, boardId, reason);
          break;
        case "board-top":
          response = isReverseBoardTop
            ? await operations.removeBoardTopTopic(topicInfo.id, boardId, reason)
            : await operations.addBoardTopTopic(
                topicInfo.id,
                boardId,
                TopicTopState.BoardTop,
                days,
                reason,
              );
          break;
        case "global-top":
          response = isReverseGlobalTop
            ? await operations.removeBoardTopTopic(topicInfo.id, boardId, reason)
            : await operations.addBoardTopTopic(
                topicInfo.id,
                boardId,
                TopicTopState.AllTop,
                days,
                reason,
              );
          break;
        case "best":
          response = isReverseBest
            ? await operations.cancelBestTopic(topicInfo.id, reason)
            : await operations.setBestTopic(topicInfo.id, reason);
          break;
        case "highlight":
          response = await operations.setHighlight(
            topicInfo.id,
            highlightStyles.includes("bold"),
            highlightStyles.includes("italic"),
            color,
            days,
            reason,
          );
          break;
      }

      if (response === "ok") {
        update();
        onCancel();
      } else {
        operations.notifyFailure(response);
      }
    } catch (error) {
      operations.notifyFailure(error);
    } finally {
      setSubmitting(false);
    }
  };

  const actionLabels: Record<TopicManagementAction, string> = {
    lock: isReverseLock ? "解锁" : "锁定",
    hot: isReverseHot ? "允许热门" : "禁止热门",
    delete: "删除",
    move: "移动",
    bump: "提升",
    "board-top": isReverseBoardTop ? "取消固顶" : "固顶",
    "global-top": isReverseGlobalTop ? "取消全站固顶" : "全站固顶",
    best: isReverseBest ? "解除精华" : "加精",
    highlight: "高亮",
  };
  const tabItems: TabItem[] = (
    Object.keys(actionLabels) as TopicManagementAction[]
  ).map((action) => ({
    id: action,
    label: actionLabels[action],
    content: renderForm(action),
    disabled: submitting && action !== current,
  }));
  const dialogStyle = {
    "--topic-management-content-height": `${dimensions.content}px`,
    "--topic-management-body-height": `${dimensions.body}px`,
  } as React.CSSProperties;

  return (
    <Dialog
      open={visible}
      title="帖子管理"
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      confirmLoading={submitting}
      maskClosable={false}
      width={800}
      className={styles.dialog}
      bodyClassName={styles.dialogBody}
      classNames={{
        viewport:
          current === "highlight" ? styles.highlightViewport : undefined,
        content: styles.dialogContent,
        footer: styles.dialogFooter,
      }}
      style={dialogStyle}
      footer={
        <>
          <Button
            className={styles.footerButton}
            disabled={submitting}
            onClick={onCancel}
            data-topic-management-cancel
          >
            取消
          </Button>
          <Button
            type="primary"
            className={styles.confirmButton}
            loading={submitting}
            disabled={submitting}
            onClick={onConfirm}
            data-topic-management-confirm
          >
            确认
          </Button>
        </>
      }
    >
      <div
        data-topic-management-action={current}
        data-topic-management-submitting={submitting ? "true" : "false"}
        data-topic-management-board-state={boardLoadState}
        data-topic-management-board-id={childBoardId ?? "none"}
        data-topic-management-color={color}
        data-topic-management-manager={isManager ? "true" : "false"}
        data-topic-management-permission-count={permissions.length}
      >
        <Tabs
          className={styles.tabs}
          items={tabItems}
          activeId={current}
          onActiveChange={(action) => {
            if (submitting) return;
            setCurrent(action as TopicManagementAction);
            setValidated(false);
          }}
          onPointerDown={(event) => {
            const target = event.target;
            if (target instanceof Element && target.closest('[role="tab"]')) {
              event.preventDefault();
            }
          }}
          ariaLabel="帖子管理操作"
        />
      </div>
    </Dialog>
  );
}
