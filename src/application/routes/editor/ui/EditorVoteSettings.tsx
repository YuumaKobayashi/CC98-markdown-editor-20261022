import * as React from "react";

import type { EditorVoteInfo } from "../model/types";
import styles from "./EditorVoteSettings.module.scss";

//TODO: 后续移除兼容层

export interface EditorVoteSettingsProps {
  voteInfo: EditorVoteInfo;
  onVoteInfoChange: (voteInfo: EditorVoteInfo) => void;
}

export function validateEditorVoteInfo(
  voteInfo: EditorVoteInfo
): string | false {
  if (voteInfo.expiredDays > 1000 || voteInfo.expiredDays < 1) {
    return "请输入合法的过期天数";
  }
  if (
    voteInfo.maxVoteCount > voteInfo.voteItems.length ||
    voteInfo.maxVoteCount < 1
  ) {
    return "请输入合法的最大投票数";
  }
  for (let index = 0; index < voteInfo.voteItems.length; index++) {
    if (!voteInfo.voteItems[index]) return "投票选项不能为空";
  }
  return false;
}

export function EditorVoteSettings({
  voteInfo,
  onVoteInfoChange,
}: EditorVoteSettingsProps): React.ReactElement {
  const changeValue = (key: string, value: any) => {
    onVoteInfoChange({
      ...voteInfo,
      [key]: value,
    });
  };

  const addVoteItem = () => {
    if (voteInfo.voteItems.length > 19) return;
    onVoteInfoChange({
      ...voteInfo,
      voteItems: [...voteInfo.voteItems, ""],
    });
  };

  const removeItem = (index: number) => {
    if (voteInfo.voteItems.length < 3) return;
    const newItems = [...voteInfo.voteItems];
    newItems.splice(index, 1);
    onVoteInfoChange({
      ...voteInfo,
      voteItems: newItems,
    });
  };

  const changeItemValue = (index: number, value: string) => {
    const newItems = [...voteInfo.voteItems];
    newItems[index] = value;
    onVoteInfoChange({
      ...voteInfo,
      voteItems: newItems,
    });
  };

  const expiredDays =
    voteInfo.expiredDays === 0 ? "" : voteInfo.expiredDays;
  const maxVoteCount =
    voteInfo.maxVoteCount === 0 ? "" : voteInfo.maxVoteCount;

  return (
    <>
      <div className={styles.createTopicTitle}>
        <span className={styles.createTopicListName}>投票设置</span>
        <span className={styles.settingsPrompt}>
          有效天数（至少1天，最多1000天）
        </span>
        <input
          className={`${styles.numberInput} ${styles.expiredDaysInput}`}
          name="expiredDays"
          type="number"
          min={1}
          max={1000}
          placeholder="请输入有效天数"
          value={expiredDays}
          onChange={(event) => {
            const newValue = parseInt(event.target.value || "0");
            if (newValue > 1000 || newValue < 0) return;
            changeValue(event.target.name, newValue);
          }}
        />
        <span>最多可投数量（至少1项，最多不超过选项数）</span>
        <input
          className={`${styles.numberInput} ${styles.maxVoteCountInput}`}
          name="maxVoteCount"
          type="number"
          min={1}
          max={voteInfo.voteItems.length}
          placeholder="请输入最多可投数量"
          value={maxVoteCount}
          onChange={(event) => {
            const newValue = parseInt(event.target.value || "0");
            if (
              newValue > voteInfo.voteItems.length ||
              newValue < 0
            ) {
              return;
            }
            changeValue(event.target.name, newValue);
          }}
        />
        <input
          className={styles.needVoteInput}
          id="needVote"
          name="needVote"
          type="checkbox"
          checked={voteInfo.needVote}
          onChange={(event) =>
            changeValue(event.target.name, event.target.checked)
          }
        />
        <label htmlFor="needVote">投票后结果可见</label>
      </div>
      {voteInfo.voteItems.map((item, index) => (
        <div
          key={`vote-option-${index}`}
          className={styles.createTopicTitle}
        >
          <span className={styles.createTopicListName}>投票选项{index + 1}</span>
          <input
            name="voteItem"
            type="text"
            value={item}
            placeholder="请输入选项内容，不能为空，最多50个字符"
            maxLength={50}
            onChange={(event) => {
              if (event.target.value.length > 50) return;
              changeItemValue(index, event.target.value);
            }}
          />
          {voteInfo.voteItems.length > 2 ? (
            <button
              type="button"
              className="fa fa-times"
              onClick={() => removeItem(index)}
            />
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={addVoteItem}
        className={`${styles.hiddenImage} ${styles.addVoteItemButton}`}
      >
        添加选项（最少2项，最多20项）
      </button>
    </>
  );
}

// 兼容旧 `Vote.isFormIllegal(...)` 静态调用形状。
export namespace EditorVoteSettings {
  export const isFormIllegal = validateEditorVoteInfo;
}
