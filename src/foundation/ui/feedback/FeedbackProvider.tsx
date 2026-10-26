import * as React from "react";
import { Toast } from "@base-ui/react/toast";

import { CloseOutlined, Icon } from "@foundation/ui/icon";
import {
  messageToastManager,
  notificationToastManager,
  type FeedbackToastData,
  type MessageStatus,
} from "./feedback-api";
import styles from "./FeedbackProvider.module.scss";

interface FeedbackProviderProps {
  children: React.ReactNode;
}

function StatusIcon({ status }: { status: MessageStatus }) {
  return (
    <Icon
      className={
        status === "success"
          ? styles.successIcon
          : status === "error"
            ? styles.errorIcon
            : styles.infoIcon
      }
      label={undefined}
    >
      {status === "info" ? (
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
      ) : status === "success" ? (
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" />
      ) : (
        <path fillRule="evenodd" d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z" />
      )}
    </Icon>
  );
}

function MessageViewport() {
  const { toasts } = Toast.useToastManager<FeedbackToastData>();

  return (
    <Toast.Portal>
      <Toast.Viewport className={styles.messageViewport} aria-label="Messages">
        {[...toasts].reverse().map((toast) => (
          <Toast.Root
            className={styles.messageRoot}
            data-owned-feedback="message"
            data-feedback-status={toast.data?.status}
            key={toast.id}
            swipeDirection={[]}
            toast={toast}
          >
            <div className={styles.messageBubble}>
              <StatusIcon status={toast.data?.status ?? "info"} />
              <Toast.Title
                className={styles.messageText}
                render={<span />}
              />
            </div>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function NotificationViewport() {
  const { toasts } = Toast.useToastManager<FeedbackToastData>();

  return (
    <Toast.Portal>
      <Toast.Viewport
        className={styles.notificationViewport}
        aria-label="Notifications"
      >
        {[...toasts].reverse().map((toast) => {
          const status = toast.data?.status ?? "info";
          const icon =
            toast.data?.icon ??
            (status === "info" ? undefined : <StatusIcon status={status} />);
          const hasIcon = icon !== undefined;
          return (
            <Toast.Root
              className={`${styles.notificationRoot}${hasIcon ? ` ${styles.notificationWithIcon}` : ""}`}
              data-owned-feedback="notification"
              data-feedback-status={toast.data?.status}
              key={toast.id}
              swipeDirection={[]}
              toast={toast}
            >
              {hasIcon && (
                <span className={styles.notificationIcon} aria-hidden="true">
                  {icon}
                </span>
              )}
              <Toast.Title className={styles.notificationTitle} />
              {toast.description !== undefined && (
                <Toast.Description className={styles.notificationDescription} />
              )}
              <Toast.Close
                className={styles.notificationClose}
                aria-label="Close notification"
              >
                <CloseOutlined label={undefined} />
              </Toast.Close>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  return (
    <Toast.Provider
      toastManager={messageToastManager}
      timeout={3000}
      limit={Number.MAX_SAFE_INTEGER}
    >
      <MessageViewport />
      <Toast.Provider
        toastManager={notificationToastManager}
        timeout={4500}
        limit={Number.MAX_SAFE_INTEGER}
      >
        <NotificationViewport />
        {children}
      </Toast.Provider>
    </Toast.Provider>
  );
}
