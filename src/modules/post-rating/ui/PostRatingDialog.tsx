import * as React from "react";

import { Dialog } from "@foundation/ui/dialog";
import { Field } from "@foundation/ui/field";
import { Select } from "@foundation/ui/select";
import { Tag } from "@foundation/ui/tag";
import { RatingType } from "@modules/post/model/dto";

import {
  getJudgeTags,
  negativeJudge,
  positiveJudge,
} from "../api/service";
import type { RatingReason } from "../model/dto";

import styles from "./PostRatingDialog.module.scss";

interface PostRatingDialogProps {
  visible: boolean;
  onCancel: () => void;
  item: { id: number };
  update: () => void;
}

export function PostRatingDialog(props: PostRatingDialogProps) {
  const [mode, setMode] = React.useState<RatingType | null>(null);
  const [selectedReasonId, setSelectedReasonId] = React.useState<number | null>(
    null
  );
  const [validationAttempted, setValidationAttempted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [positiveTags, setPositiveTags] = React.useState<RatingReason[]>([]);
  const [negativeTags, setNegativeTags] = React.useState<RatingReason[]>([]);
  const reasonErrorId = React.useId();

  const handleModeChange = (nextMode: RatingType) => {
    if (nextMode === RatingType.Add && positiveTags.length === 0) {
      getJudgeTags(RatingType.Add).then(setPositiveTags);
    }
    if (nextMode === RatingType.Subtract && negativeTags.length === 0) {
      getJudgeTags(RatingType.Subtract).then(setNegativeTags);
    }

    setSelectedReasonId(null);
    setValidationAttempted(false);
    setMode(nextMode);
  };

  const onCreate = async () => {
    let status = "";

    if (selectedReasonId === null) {
      setValidationAttempted(true);
      return;
    }

    setLoading(true);
    try {
      switch (mode) {
        case RatingType.Add:
          status = await positiveJudge(
            props.item.id,
            selectedReasonId,
            RatingType.Add
          );
          break;
        case RatingType.Subtract:
          status = await negativeJudge(
            props.item.id,
            selectedReasonId,
            RatingType.Subtract
          );
          break;
        case null:
          alert("请选择加风评还是扣风评。");
          break;
      }
      if (status === "ok") {
        props.update();
        props.onCancel();
      } else {
        switch (status) {
          case "post_data_error":
            alert("提交数据类型错误");
            break;
          case "cannot_rate_yourself":
            alert("您不能给自己评分哦~");
            break;
          case "post_more_than_7_days":
            alert("超过7天的发言内容无法评分");
            break;
          case "you_cannot_rate":
            alert("您还没有资格评分~");
            break;
          case "board_cannot_rate":
            alert("该版面无法评分");
            break;
          case "has_rated_today":
            alert("您今天已经评分过了~");
            break;
          case "has_rated_this_post":
            alert("您已对当前发言进行过评分操作~");
            break;
          case "post_not_exists":
            alert("发言不存在");
            break;
          case "topic_not_exists":
            alert("主题不存在");
            break;
          case "post_user_not_exists":
            alert("发言用户不存在");
            break;
          default:
            alert("未知错误");
            break;
        }
      }
    } catch (_error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  const reasons =
    mode === RatingType.Add
      ? positiveTags
      : mode === RatingType.Subtract
        ? negativeTags
        : [];
  const options = reasons
    .filter((reason) => reason.enabled)
    .map((reason) => ({ value: reason.id, label: reason.reason }));
  const showReasonError =
    validationAttempted && selectedReasonId === null;

  return (
    <Dialog
      open={props.visible}
      title="评分"
      confirmText="确 认"
      cancelText="取 消"
      confirmLoading={loading}
      onConfirm={onCreate}
      onOpenChange={(open) => {
        if (!open) props.onCancel();
      }}
      preserveOnClose
    >
      <div className={styles.modeGroup} role="group" aria-label="评分类型">
        <button
          className={styles.modeButton}
          type="button"
          aria-pressed={mode === RatingType.Add}
          onClick={() => handleModeChange(RatingType.Add)}
        >
          <img
            className={styles.modeImage}
            src="/static/images/j-plus1.png"
            alt=""
          />
          <span className={styles.modeLabel}>+1</span>
        </button>
        <span className={styles.divider} aria-hidden="true">
          |
        </span>
        <button
          className={styles.modeButton}
          type="button"
          aria-pressed={mode === RatingType.Subtract}
          onClick={() => handleModeChange(RatingType.Subtract)}
        >
          <img
            className={styles.modeImage}
            src="/static/images/j-minus1.png"
            alt=""
          />
          <span className={styles.modeLabel}>-1</span>
        </button>
      </div>

      <Tag color="blue">
        500帖以上的用户可以进行评分（每日一次），超过7天的发言内容无法评分。
      </Tag>

      <div className={styles.formArea}>
        <Field
          label="理由"
          required
          error={showReasonError ? "请选择理由" : undefined}
          errorId={reasonErrorId}
          classNames={{
            root: styles.field,
            label: styles.label,
            control: styles.control,
          }}
        >
          <Select<number>
            ariaLabel="理由"
            ariaInvalid={showReasonError}
            ariaDescribedBy={showReasonError ? reasonErrorId : undefined}
            className={styles.reasonSelect}
            classNames={{
              trigger: styles.selectTrigger,
              positioner: styles.selectPositioner,
              popup: styles.selectPopup,
              item: styles.selectItem,
            }}
            disabled={mode === null}
            options={options}
            value={selectedReasonId}
            onValueChange={(value) => {
              setSelectedReasonId(value);
              setValidationAttempted(false);
            }}
          />
        </Field>
        {mode === null && (
          <div className={styles.hint}>
            提示：请先点击“+1”或者“-1”，再选择理由。
          </div>
        )}
      </div>
    </Dialog>
  );
}
