import type * as React from "react";
import { Toast } from "@base-ui/react/toast";

export type FeedbackKey = React.Key;
export type MessageStatus = "info" | "success" | "error";

export interface MessageOptions {
  content: React.ReactNode;
  duration?: number;
  key?: FeedbackKey;
  onClose?: () => void;
}

export interface NotificationOptions {
  message: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  key?: FeedbackKey;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export interface FeedbackToastData {
  channel: "message" | "notification";
  status: MessageStatus;
  icon?: React.ReactNode;
}

export const messageToastManager =
  Toast.createToastManager<FeedbackToastData>();
export const notificationToastManager =
  Toast.createToastManager<FeedbackToastData>();

function timeoutFromDuration(duration: number | undefined) {
  return duration === undefined ? undefined : duration * 1000;
}

function idFromKey(key: FeedbackKey | undefined) {
  return key === undefined ? undefined : String(key);
}

function normalizeMessageOptions(
  input: React.ReactNode | MessageOptions,
  duration?: number,
): MessageOptions {
  if (
    typeof input === "object" &&
    input !== null &&
    !Array.isArray(input) &&
    !Reflect.has(input, "$$typeof") &&
    Reflect.has(input, "content")
  ) {
    return input as MessageOptions;
  }

  return { content: input as React.ReactNode, duration };
}

function showMessage(
  status: MessageStatus,
  input: React.ReactNode | MessageOptions,
  duration?: number,
) {
  const options = normalizeMessageOptions(input, duration);
  return messageToastManager.add({
    id: idFromKey(options.key),
    title: options.content,
    type: status,
    timeout: timeoutFromDuration(options.duration),
    priority: status === "error" ? "high" : "low",
    onClose: options.onClose,
    data: { channel: "message", status },
  });
}

export const message = {
  info(input: React.ReactNode | MessageOptions, duration?: number) {
    return showMessage("info", input, duration);
  },
  success(input: React.ReactNode | MessageOptions, duration?: number) {
    return showMessage("success", input, duration);
  },
  error(input: React.ReactNode | MessageOptions, duration?: number) {
    return showMessage("error", input, duration);
  },
  destroy(key?: FeedbackKey) {
    messageToastManager.close(idFromKey(key));
  },
};

function showNotification(
  status: MessageStatus,
  options: NotificationOptions,
) {
  return notificationToastManager.add({
    id: idFromKey(options.key),
    title: options.message,
    description: options.description,
    type: status,
    timeout: timeoutFromDuration(options.duration),
    priority: "high",
    onClose: options.onClose,
    data: {
      channel: "notification",
      status,
      icon: options.icon,
    },
  });
}

export const notification = {
  open(options: NotificationOptions) {
    return showNotification("info", options);
  },
  success(options: NotificationOptions) {
    return showNotification("success", options);
  },
  error(options: NotificationOptions) {
    return showNotification("error", options);
  },
  destroy(key?: FeedbackKey) {
    notificationToastManager.close(idFromKey(key));
  },
};
