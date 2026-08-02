import * as React from "react";
import moment from "moment";

import { UbbContainer } from "@legacy/Components/UbbContainer";

import type { MessageResponseProps } from "../model/types";
import styles from "./MessageResponseItem.module.scss";

interface MessageResponseItemProps {
  boardName: string;
  content: string;
  time: MessageResponseProps["time"];
  options: React.ComponentProps<typeof UbbContainer>["options"];
}

/** 回复与提及通知共同的版面、时间和正文骨架。 */
export function MessageResponseItem({
  boardName,
  content,
  time,
  options,
}: MessageResponseItemProps): React.ReactElement {
  return (
    <div className={styles["message-response-box"]}>
      <div className={styles["message-response-box-middle"]}>
        <div className={styles["message-response-box-middle1"]}>
          <div className={styles["message-response-box-middle-title"]}>
            <UbbContainer code={boardName} />
          </div>
          <div className={styles["message-response-box-middle-date"]}>
            {moment(time).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
        <div className={styles["message-response-box-middle-content"]}>
          <UbbContainer code={content} options={options} />
        </div>
      </div>
    </div>
  );
}
