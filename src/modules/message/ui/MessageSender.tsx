// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import {
  MessageConversationItem,
  type MessageSendReceiveProps,
} from "./MessageConversationItem";

export function MessageSender(
  props: MessageSendReceiveProps,
): React.ReactElement {
  return <MessageConversationItem {...props} direction="sender" />;
}
