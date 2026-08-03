import * as React from "react";
import moment from "moment";

import { UbbContainer } from "@modules/ubb";

import styles from "./MessageConversationItem.module.scss";

/**
 * 一条站短消息
 */
export interface MessageSendReceiveProps {
  /**
   * 消息的标识
   */
  id: number;
  /**
   * 消息的发送者的名字
   */
  senderName: string;
  /**
   * 消息的发送者的id
   */
  senderId: number;
  /**
   * 消息的接收者的名字
   */
  receiverName: string;
  /**
   * 消息的接收者的id
   */
  receiverId: number;
  /**
   * 消息的发送者的头像地址
   */
  senderPortraitUrl: string;
  /**
   * 消息的接收者的头像地址
   */
  receiverPortraitUrl: string;
  /**
   * 消息的正文
   */
  content: string;
  /**
   * 消息是否已经被阅读。true 表示消息已经阅读，false 表示消息尚未阅读
   */
  isRead: boolean;
  /**
   * 消息的发送时间
   */
  time: string;
  /**
   * 是否显示发送时间
   */
  showTime: boolean;
}

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
