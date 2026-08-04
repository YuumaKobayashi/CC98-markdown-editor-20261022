import * as React from "react";
import moment from "moment";

import { UbbContainer } from "@modules/ubb/UbbContainer";

import type { ReplyAtNotificationViewModel } from "../model/view-model";
import styles from "./MessageResponseItem.module.scss";

/** 旧组件 props 名；组件只接收 ViewModel 中实际渲染的字段。 */
export type MessageResponseProps = Omit<
  ReplyAtNotificationViewModel,
  "postId" | "postBasicInfo"
>;

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
