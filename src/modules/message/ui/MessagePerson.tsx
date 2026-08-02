// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";

import { UbbContainer } from "@modules/ubb";
import type { MessagePersonInfo } from "../model/MessagePersonInfo";
import styles from "./MessagePerson.module.scss";

interface MessagePersonProps {
  data: MessagePersonInfo;
}

interface UnreadDotProps {
  isRead: boolean;
}

function UnreadDot({ isRead }: UnreadDotProps) {
  if (isRead) {
    return <div className={styles["message-counterPerson"]} hidden></div>;
  }

  return <div className={styles["message-counterPerson"]}></div>;
}

export function MessagePerson({ data }: MessagePersonProps) {
  const lastContent = data.lastContent || "";

  return (
    <div className={styles["message-message-person"]}>
      <img className={styles["message-message-pPortraitUrl"]} src={data.portraitUrl} />
      <div className={styles["message-message-pInfo"]}>
        <div className={styles["message-message-pName"]}>{data.name}</div>
        <div className={styles["message-message-pMessage"]}>
          <UbbContainer code={lastContent} />
        </div>
      </div>
      <UnreadDot isRead={data.isRead}></UnreadDot>
    </div>
  );
}
