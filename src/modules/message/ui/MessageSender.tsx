// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import moment from "moment";
import { UbbContainer } from "@legacy/Components/UbbContainer";
import { MessageSendReceiveProps } from "../model/types";

export function MessageSender(
  props: MessageSendReceiveProps,
): React.ReactElement {
  const userUrl = `/user/id/${props.senderId}`;
  let timeClassName: string;
  if (props.showTime) {
    timeClassName = "message-message-wcTime";
  } else {
    timeClassName = "displaynone";
  }

  return (
    <div className="message-message-wc">
      <div className={timeClassName}>
        {moment(props.time).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <div className="message-message-wcSender">
        <a href={userUrl} target="_blank">
          <img
            className="message-message-wcPortraitUrl"
            src={props.senderPortraitUrl}
          />
        </a>
        <div className="message-message-wcContent">
          <div
            id={String(props.id)}
            className="message-message-wcText"
          >
            <UbbContainer code={props.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
