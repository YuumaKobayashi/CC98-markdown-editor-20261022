// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";

import { UbbContainer } from "@legacy/Components/UbbContainer";
import type { MessagePersonInfo } from "@legacy/Props/MessagePersonInfo";

interface MessagePersonProps {
  data: MessagePersonInfo;
}

interface UnreadDotProps {
  isRead: boolean;
}

function UnreadDot({ isRead }: UnreadDotProps) {
  if (isRead) {
    return <div className="message-counterPerson displaynone"></div>;
  }

  return <div className="message-counterPerson"></div>;
}

export function MessagePerson({ data }: MessagePersonProps) {
  const lastContent = data.lastContent || "";

  return (
    <div className="message-message-person">
      <img className="message-message-pPortraitUrl" src={data.portraitUrl} />
      <div className="message-message-pInfo">
        <div className="message-message-pName">{data.name}</div>
        <div className="message-message-pMessage">
          <UbbContainer code={lastContent} />
        </div>
      </div>
      <UnreadDot isRead={data.isRead}></UnreadDot>
    </div>
  );
}
