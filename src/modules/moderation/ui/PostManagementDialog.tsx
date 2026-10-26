import * as React from "react";

import { Dialog } from "@foundation/ui/dialog";
import { Field } from "@foundation/ui/field";
import { Input } from "@foundation/ui/input";
import { NumberInput } from "@foundation/ui/number-input";
import { Tabs, type TabItem } from "@foundation/ui/tabs";
import { Tag } from "@foundation/ui/tag";
import { TagsInput } from "@foundation/ui/tags-input";
import {
  addPrestige,
  awardWealth,
  deductPrestige,
  deductWealth,
  type PostOperationResult,
} from "@modules/post-rating/api/service";

import {
  cancelStopBoardPost,
  deletePost,
  stopBoardPost,
  type ModerationResult,
} from "../api/service";
import styles from "./PostManagementDialog.module.scss";

export type PostManagementAction =
  | "wealth"
  | "prestige"
  | "punishwealth"
  | "punishprestige"
  | "delete"
  | "tp"
  | "canceltp";

type PostManagementOperationResult = PostOperationResult | ModerationResult;

export interface PostManagementOperations {
  awardWealth: (
    reason: string,
    value: number,
    postId: number,
  ) => Promise<PostManagementOperationResult>;
  addPrestige: (
    postId: number,
    value: number,
    reason: string,
  ) => Promise<PostManagementOperationResult>;
  deductWealth: (
    reason: string,
    value: number,
    postId: number,
  ) => Promise<PostManagementOperationResult>;
  deductPrestige: (
    postId: number,
    value: number,
    reason: string,
  ) => Promise<PostManagementOperationResult>;
  deletePost: (
    topicId: number,
    postId: number,
    reason: string,
  ) => Promise<PostManagementOperationResult>;
  stopBoardPost: (
    postId: number,
    reason: string,
    days: number,
  ) => Promise<PostManagementOperationResult>;
  cancelStopBoardPost: (
    userId: number,
    boardId: number,
  ) => Promise<PostManagementOperationResult>;
}

export interface PostManagementDialogProps {
  update: () => void;
  privilege: string | null;
  item: {
    id: number;
    topicId: number;
    userId: number;
  } | null;
  boardId: number;
  d_wealth: number;
  m_wealth: number | null;
  boardName: string;
  visible: boolean;
  onCancel: () => void;
  operations?: PostManagementOperations;
  initialAction?: PostManagementAction;
}

interface ActionDraft {
  amount: number | null;
  days: number | null;
  tags: string[];
  reason: string;
}

interface ActionErrors {
  amount?: string;
  days?: string;
  reason?: string;
}

const positiveReasonOptions = ["好文章", "有用资源", "热心回复"];
const punishmentReasonOptions = ["人身攻击", "违反版规", "恶意灌水"];

const actionLabels: Record<PostManagementAction, string> = {
  wealth: "奖励财富值",
  prestige: "奖励威望",
  punishwealth: "扣除财富值",
  punishprestige: "扣除威望",
  delete: "删除",
  tp: "TP",
  canceltp: "解除TP",
};

const defaultOperations: PostManagementOperations = {
  awardWealth,
  addPrestige,
  deductWealth,
  deductPrestige,
  deletePost,
  stopBoardPost,
  cancelStopBoardPost,
};

function createInitialDrafts(): Record<PostManagementAction, ActionDraft> {
  return {
    wealth: { amount: null, days: null, tags: [], reason: "" },
    prestige: { amount: null, days: null, tags: [], reason: "" },
    punishwealth: { amount: null, days: null, tags: [], reason: "" },
    punishprestige: {
      amount: null,
      days: null,
      tags: ["人身攻击"],
      reason: "",
    },
    delete: { amount: null, days: null, tags: [], reason: "" },
    tp: { amount: null, days: null, tags: [], reason: "" },
    canceltp: { amount: null, days: null, tags: [], reason: "" },
  };
}

function validateDraft(
  action: PostManagementAction,
  draft: ActionDraft,
): ActionErrors {
  const errors: ActionErrors = {};

  if (action === "wealth" || action === "punishwealth") {
    if (draft.amount === null) errors.amount = "请输入财富值";
  }
  if (action === "prestige" || action === "punishprestige") {
    if (draft.amount === null) errors.amount = "请输入威望值";
  }
  if (action === "tp" && draft.days === null) {
    errors.days = "请输入tp天数";
  }
  if (
    ["wealth", "prestige", "punishwealth", "punishprestige"].includes(
      action,
    ) &&
    draft.tags.length === 0
  ) {
    errors.reason = "请输入理由";
  }
  if ((action === "delete" || action === "tp") && draft.reason.length === 0) {
    errors.reason = "请输入理由";
  }

  return errors;
}

export function PostManagementDialog({
  update,
  item,
  boardId,
  d_wealth,
  m_wealth,
  boardName,
  visible,
  onCancel,
  operations = defaultOperations,
  initialAction = "wealth",
}: PostManagementDialogProps) {
  const instanceId = React.useId().replace(/:/g, "");
  const [current, setCurrent] =
    React.useState<PostManagementAction>(initialAction);
  const [drafts, setDrafts] = React.useState(createInitialDrafts);
  const [validatedAction, setValidatedAction] =
    React.useState<PostManagementAction | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const updateDraft = (
    action: PostManagementAction,
    patch: Partial<ActionDraft>,
  ) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [action]: { ...currentDrafts[action], ...patch },
    }));
  };

  const getErrors = (action: PostManagementAction) =>
    validatedAction === action ? validateDraft(action, drafts[action]) : {};

  const renderNumberField = (
    action: PostManagementAction,
    label: string,
  ) => {
    const draft = drafts[action];
    const error = getErrors(action).amount;
    const controlId = `${instanceId}-${action}-amount`;
    const errorId = `${instanceId}-${action}-amount-error`;

    return (
      <Field
        label={label}
        controlId={controlId}
        required
        error={error}
        errorId={errorId}
        classNames={{
          root: styles.field,
          label: styles.label,
          error: styles.error,
        }}
      >
        <NumberInput
          id={controlId}
          className={styles.numberInput}
          value={draft.amount}
          onValueChange={(amount) => updateDraft(action, { amount })}
          status={error ? "error" : undefined}
          ariaLabel={label}
          ariaInvalid={Boolean(error)}
          ariaDescribedBy={error ? errorId : undefined}
          required
        />
      </Field>
    );
  };

  const renderTagsField = (
    action: PostManagementAction,
    options: readonly string[],
  ) => {
    const draft = drafts[action];
    const error = getErrors(action).reason;
    const controlId = `${instanceId}-${action}-reason`;
    const errorId = `${instanceId}-${action}-reason-error`;

    return (
      <Field
        label="理由"
        controlId={controlId}
        required
        error={error}
        errorId={errorId}
        classNames={{
          root: styles.field,
          label: styles.label,
          error: styles.error,
        }}
      >
        <TagsInput
          id={controlId}
          className={styles.tagsInput}
          classNames={{
            root: error ? styles.invalidTagsInput : undefined,
            control: error ? styles.invalidTagsControl : undefined,
            positioner: styles.tagsPositioner,
          }}
          value={draft.tags}
          onValueChange={(tags) => updateDraft(action, { tags })}
          options={options}
          status={error ? "error" : undefined}
          ariaLabel="理由"
          ariaInvalid={Boolean(error)}
          ariaDescribedBy={error ? errorId : undefined}
          placeholder=""
          required
        />
      </Field>
    );
  };

  const renderTextField = (action: "delete" | "tp") => {
    const draft = drafts[action];
    const error = getErrors(action).reason;
    const controlId = `${instanceId}-${action}-reason`;
    const errorId = `${instanceId}-${action}-reason-error`;

    return (
      <Field
        label="理由"
        controlId={controlId}
        required
        error={error}
        errorId={errorId}
        classNames={{
          root: styles.field,
          label: styles.label,
          error: styles.error,
        }}
      >
        <Input
          id={controlId}
          className={styles.textInput}
          value={draft.reason}
          onChange={(event) =>
            updateDraft(action, { reason: event.currentTarget.value })
          }
          status={error ? "error" : undefined}
          aria-label="理由"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          required
        />
      </Field>
    );
  };

  const renderForm = (action: PostManagementAction) => {
    switch (action) {
      case "wealth":
        return (
          <div className={styles.form} data-post-management-form={action}>
            <Tag color="blue" className={styles.notice}>
              您今天在{boardName}已经发了{d_wealth} 财富值，最多可发
              {m_wealth || "不限"} （单次最多1000）
            </Tag>
            {renderNumberField(action, "财富值")}
            {renderTagsField(action, positiveReasonOptions)}
          </div>
        );
      case "prestige":
        return (
          <div className={styles.form} data-post-management-form={action}>
            {renderNumberField(action, "威望")}
            {renderTagsField(action, positiveReasonOptions)}
          </div>
        );
      case "punishwealth":
        return (
          <div className={styles.form} data-post-management-form={action}>
            {renderNumberField(action, "财富值")}
            {renderTagsField(action, punishmentReasonOptions)}
          </div>
        );
      case "punishprestige":
        return (
          <div className={styles.form} data-post-management-form={action}>
            {renderNumberField(action, "威望")}
            {renderTagsField(action, punishmentReasonOptions)}
          </div>
        );
      case "delete":
        return (
          <div className={styles.form} data-post-management-form={action}>
            {renderTextField(action)}
          </div>
        );
      case "tp": {
        const draft = drafts.tp;
        const error = getErrors("tp").days;
        const controlId = `${instanceId}-tp-days`;
        const errorId = `${instanceId}-tp-days-error`;
        return (
          <div className={styles.form} data-post-management-form={action}>
            <Field
              label="天数"
              controlId={controlId}
              required
              error={error}
              errorId={errorId}
              classNames={{
                root: styles.field,
                label: styles.label,
                error: styles.error,
              }}
            >
              <NumberInput
                id={controlId}
                className={styles.numberInput}
                value={draft.days}
                onValueChange={(days) => updateDraft("tp", { days })}
                status={error ? "error" : undefined}
                ariaLabel="天数"
                ariaInvalid={Boolean(error)}
                ariaDescribedBy={error ? errorId : undefined}
                required
              />
            </Field>
            {renderTextField(action)}
          </div>
        );
      }
      case "canceltp":
        return (
          <div className={styles.cancelTp} data-post-management-form={action}>
            解除此用户版面 tp
          </div>
        );
    }
  };

  const onConfirm = async () => {
    if (!item || submitting) return;

    const draft = drafts[current];
    const errors = validateDraft(current, draft);
    if (Object.keys(errors).length > 0) {
      setValidatedAction(current);
      return;
    }

    setSubmitting(true);
    let response: PostManagementOperationResult | null = null;

    try {
      switch (current) {
        case "wealth":
          response = await operations.awardWealth(
            draft.tags.join(","),
            parseInt(String(draft.amount), 10),
            item.id,
          );
          break;
        case "prestige":
          response = await operations.addPrestige(
            item.id,
            parseInt(String(draft.amount), 10),
            draft.tags.join(","),
          );
          break;
        case "punishwealth":
          response = await operations.deductWealth(
            draft.tags.join(","),
            parseInt(String(draft.amount), 10),
            item.id,
          );
          break;
        case "punishprestige":
          response = await operations.deductPrestige(
            item.id,
            parseInt(String(draft.amount), 10),
            draft.tags.join(","),
          );
          break;
        case "delete":
          response = await operations.deletePost(
            item.topicId,
            item.id,
            draft.reason,
          );
          break;
        case "tp":
          response = await operations.stopBoardPost(
            item.id,
            draft.reason,
            parseInt(String(draft.days), 10),
          );
          break;
        case "canceltp":
          response = await operations.cancelStopBoardPost(item.userId, boardId);
          break;
      }

      if (response === "ok") {
        update();
        onCancel();
      } else {
        window.alert(response);
      }
    } catch (_error) {
      return;
    } finally {
      setSubmitting(false);
    }
  };

  if (!item) return null;

  const tabItems: TabItem[] = (
    Object.keys(actionLabels) as PostManagementAction[]
  ).map((action) => ({
    id: action,
    label: actionLabels[action],
    content: renderForm(action),
  }));

  return (
    <Dialog
      open={visible}
      title="发言管理"
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      onConfirm={onConfirm}
      confirmText="确认"
      cancelText="取消"
      confirmLoading={submitting}
      width="50rem"
      className={styles.dialog}
      bodyClassName={styles.dialogBody}
      classNames={{
        content: styles.dialogContent,
        footer: styles.dialogFooter,
        cancel: styles.footerButton,
        confirm: styles.footerButton,
      }}
    >
      <div
        data-post-management-action={current}
        data-post-management-submitting={submitting ? "true" : "false"}
      >
        <Tabs
          className={styles.tabs}
          items={tabItems}
          activeId={current}
          onActiveChange={(action) => {
            setCurrent(action as PostManagementAction);
            setValidatedAction(null);
          }}
          ariaLabel="发言管理操作"
        />
      </div>
    </Dialog>
  );
}
