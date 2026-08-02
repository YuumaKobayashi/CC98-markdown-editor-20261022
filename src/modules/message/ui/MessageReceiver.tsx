// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import type { MessageSendReceiveProps } from "../model/types";
import { MessageConversationItem } from "./MessageConversationItem";

export function MessageReceiver(
  props: MessageSendReceiveProps,
): React.ReactElement {
  //console.log(props);
  return <MessageConversationItem {...props} direction="receiver" />;
}
