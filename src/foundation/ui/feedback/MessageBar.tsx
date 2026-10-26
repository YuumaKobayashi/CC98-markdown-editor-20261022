import * as React from "react";

import styles from "./MessageBar.module.scss";

interface MessageBarProps {
  message: string;
  messageType?: MessageType;
}

export enum MessageType {
  Info,
  Success,
  Warning,
  Error,
}

/**
 * 显示 UBB 权限标签等调用方传入的状态消息。
 * 枚举取值与旧组件一致，未显式处理的 Warning/Error 继续使用红色样式。
 */
export function MessageBar({
  message,
  messageType,
}: MessageBarProps): React.ReactElement {
  let statusClassName: string;

  switch (messageType) {
    case MessageType.Success:
      statusClassName = styles.success;
      break;
    case MessageType.Info:
      statusClassName = styles.info;
      break;
    default:
      statusClassName = styles.error;
      break;
  }

  return (
    <div>
      <div className={`${styles.message} ${statusClassName}`}>{message}</div>
    </div>
  );
}
