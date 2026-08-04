import * as React from "react";
import { TopicBestState } from "@modules/topic/model/dto";
import { type ITagGroup } from "@modules/topic/model/dto";
import { Select } from "antd";

import styles from "./BoardTopicToolbar.module.scss";

const Option = Select.Option;

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
              style={{ width: 120 }}
              onChange={handleTag1Change}
            >
              <Option value={-1}>全部</Option>
              {tags[0].tags.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          ) : null}
          {tags.length > 1 ? (
            <Select
              defaultValue={-1}
              style={{ width: 120, marginLeft: 20 }}
              onChange={handleTag2Change}
            >
              <Option value={-1}>全部</Option>
              {tags[1].tags.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
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
