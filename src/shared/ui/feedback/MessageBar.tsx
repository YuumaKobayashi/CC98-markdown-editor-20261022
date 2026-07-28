import * as React from "react";

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
  let wrapperStyle: React.CSSProperties;

  switch (messageType) {
    case MessageType.Success:
      wrapperStyle = {
        backgroundColor: "#F5FAFF",
        border: "1px solid rgb(204,204,204)",
        padding: "10px 17px",
        color: "darkgreen",
        margin: "6px 0",
      };
      break;
    case MessageType.Info:
      wrapperStyle = {
        backgroundColor: "#F5FAFF",
        border: "1px solid rgb(204,204,204)",
        padding: "10px 17px",
        color: "darkblue",
        margin: "6px 0",
      };
      break;
    default:
      wrapperStyle = {
        backgroundColor: "#F5FAFF",
        border: "1px solid rgb(204,204,204)",
        padding: "10px 17px",
        color: "red",
        margin: "6px 0",
      };
      break;
  }

  return (
    <div>
      <div style={wrapperStyle}>{message}</div>
    </div>
  );
}
