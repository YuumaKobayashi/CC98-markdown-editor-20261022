import * as React from "react";
import { Select } from "@foundation/ui/select";
import { TopicBestState } from "@modules/topic/model/dto";
import { type ITagGroup } from "@modules/topic/model/dto";

import styles from "./BoardTopicToolbar.module.scss";

interface BoardTopicToolbarProps {
  onChange: (type: TopicBestState) => void;
  tags: ITagGroup[];
  handleTag1Change: (value: number) => void;
  handleTag2Change: (value: number) => void;
}

export function BoardTopicToolbar({
  onChange,
  tags,
  handleTag1Change,
  handleTag2Change,
}: BoardTopicToolbarProps) {
  return (
    <div className={styles["board-postItem-head"]}>
      <div className={styles["board-postItem-head-left"]}>
        <div className={styles["board-postItem-head-left-part"]}>
          <div
            className={styles["board-postItem-head-option"]}
            onClick={() => onChange(TopicBestState.None)}
          >
            全部
          </div>
          <div
            className={styles["board-postItem-head-option"]}
            onClick={() => onChange(TopicBestState.Best)}
          >
            精华
          </div>
          <div
            className={styles["board-postItem-head-option"]}
            onClick={() => onChange(TopicBestState.Save)}
          >
            保存
          </div>
        </div>
        <div className={styles["board-postItem-head-left-part"]}>
          {tags.length > 0 ? (
            <Select
              defaultValue={-1}
              className={styles.topicSelect}
              ariaLabel="第一组标签筛选"
              options={[
                { value: -1, label: "全部" },
                ...tags[0].tags.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
              onValueChange={(value) => {
                if (value !== null) handleTag1Change(value);
              }}
            />
          ) : null}
          {tags.length > 1 ? (
            <Select
              defaultValue={-1}
              className={`${styles.topicSelect} ${styles.secondTopicSelect}`}
              ariaLabel="第二组标签筛选"
              options={[
                { value: -1, label: "全部" },
                ...tags[1].tags.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
              onValueChange={(value) => {
                if (value !== null) handleTag2Change(value);
              }}
            />
          ) : null}
        </div>
      </div>

      <div className={styles["board-postItem-head-right"]}>
        <div className={styles["board-postItem-head-userName"]}>作者</div>
        <div className={styles["board-postItem-head-hitcount"]}>点击</div>
        <div className={styles["board-postItem-head-reply"]}>回复</div>
        <div className={styles["board-postItem-head-lastReply"]}>
          最后回复
        </div>
      </div>
    </div>
  );
}
