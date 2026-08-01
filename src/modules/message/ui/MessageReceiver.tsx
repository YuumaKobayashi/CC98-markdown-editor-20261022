// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import moment from "moment";
import { UbbContainer } from "@legacy/Components/UbbContainer";
import { MessageSendReceiveProps } from "../model/types";
import styles from "./MessageConversationItem.module.scss";

export function MessageReceiver(
  props: MessageSendReceiveProps,
): React.ReactElement {
  //console.log(props);
  const userUrl = `/user/id/${props.senderId}`;
  return (
    <div className={styles["message-message-wc"]}>
      <div className={styles["message-message-wcTime"]} hidden={!props.showTime}>
        {moment(props.time).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <div className={styles["message-message-wcReceiver"]}>
        <a href={userUrl} target="_blank">
          <img
            className={styles["message-message-wcPortraitUrl"]}
            src={props.senderPortraitUrl}
          />
        </a>
        <div className={styles["message-message-wcContent"]}>
          <div
            className={styles["message-message-wcText"]}
            id={String(props.id)}
          >
            <UbbContainer code={props.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
