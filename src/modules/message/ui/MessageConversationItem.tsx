import * as React from "react";
import moment from "moment";

import { UbbContainer } from "@modules/ubb";

import type { MessageSendReceiveProps } from "../model/types";
import styles from "./MessageConversationItem.module.scss";

interface MessageConversationItemProps extends MessageSendReceiveProps {
  direction: "sender" | "receiver";
}

/** 私信会话中共同的头像、正文与时间骨架。 */
export function MessageConversationItem({
  direction,
  ...props
}: MessageConversationItemProps): React.ReactElement {
  const userUrl = `/user/id/${props.senderId}`;
  const directionClassName =
    direction === "sender"
      ? styles["message-message-wcSender"]
      : styles["message-message-wcReceiver"];

  return (
    <div className={styles["message-message-wc"]}>
      <div className={styles["message-message-wcTime"]} hidden={!props.showTime}>
        {moment(props.time).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <div className={directionClassName}>
        <a href={userUrl} target="_blank">
          <img
            className={styles["message-message-wcPortraitUrl"]}
            src={props.senderPortraitUrl}
          />
        </a>
        <div className={styles["message-message-wcContent"]}>
          <div
            id={String(props.id)}
            className={styles["message-message-wcText"]}
          >
            <UbbContainer code={props.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
