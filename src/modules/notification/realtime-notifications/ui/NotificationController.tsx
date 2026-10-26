import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AnyAction } from "redux";
import type { ThunkDispatch } from "redux-thunk";

import { selectIsLogOn } from "@modules/session/model/selectors";
import { type SessionState } from "@modules/session/model/types";
import { CC98SignalR } from "../signalr";
import { setLocalStorage } from "@foundation/storage/web-storage";
import {
  navigateToNotificationResponse,
} from "../../lib/notification-navigation";
import { BlinkTitle } from "../../lib/title-blinker";
import { refreshUnreadCount } from "../../model/refresh-unread-count";
import { selectUnreadCount } from "../../model/selectors";
import type { UnreadCount } from "../../model/dto";
import { replaceUnreadCount } from "../../model/unread-count-slice";

const messageEvents = [
  "NotifyMessageReceive",
  "NotifyNotificationReceive",
] as const;

const parseStoredMessageCount = (value: string): UnreadCount =>
  JSON.parse(value.slice(4)) as UnreadCount;

interface NotificationControllerRootState {
  notification: UnreadCount;
  session: SessionState;
}

type NotificationControllerDispatch = ThunkDispatch<
  NotificationControllerRootState,
  void,
  AnyAction
>;

export function NotificationController() {
  const dispatch = useDispatch<NotificationControllerDispatch>();
  const isLoggedOn = useSelector<NotificationControllerRootState, boolean>(
    selectIsLogOn
  );
  const messageCount = useSelector<
    NotificationControllerRootState,
    UnreadCount
  >(selectUnreadCount);

  const handleNotifyMessageReceive = React.useCallback(() => {
    void dispatch(refreshUnreadCount());

    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      const notification = new Notification("您有一条新的消息", {
        icon: "/static/98icon.ico",
      });
      notification.onclick = () => {
        window.focus();
        navigateToNotificationResponse();
      };
    }
  }, [dispatch]);

  const removeMessageHandlers = React.useCallback(() => {
    if (!CC98SignalR.connection) return;
    messageEvents.forEach((eventName) => {
      CC98SignalR.connection.off(eventName, handleNotifyMessageReceive);
    });
  }, [handleNotifyMessageReceive]);

  const addMessageHandlers = React.useCallback(() => {
    messageEvents.forEach((eventName) => {
      CC98SignalR.connection.on(eventName, handleNotifyMessageReceive);
    });
  }, [handleNotifyMessageReceive]);

  React.useEffect(() => {
    if (!isLoggedOn) {
      removeMessageHandlers();
      if (CC98SignalR.connection) void CC98SignalR.stop();
      return;
    }

    let isActive = true;
    void dispatch(refreshUnreadCount());

    const startConnection = async () => {
      await CC98SignalR.start();
      if (!isActive) {
        void CC98SignalR.stop();
        return;
      }
      setLocalStorage("signalr", Date.now());
      addMessageHandlers();
    };
    void startConnection();

    return () => {
      isActive = false;
      removeMessageHandlers();
      if (CC98SignalR.connection) void CC98SignalR.stop();
    };
  }, [
    addMessageHandlers,
    dispatch,
    isLoggedOn,
    removeMessageHandlers,
  ]);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === "signalr" &&
        event.oldValue !== event.newValue &&
        event.newValue
      ) {
        removeMessageHandlers();
        if (CC98SignalR.connection) void CC98SignalR.stop();
        return;
      }

      if (
        event.key === "messageCount" &&
        event.oldValue !== event.newValue &&
        event.newValue
      ) {
        dispatch(
          replaceUnreadCount(
            parseStoredMessageCount(event.newValue)
          )
        );
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch, removeMessageHandlers]);

  React.useEffect(() => {
    const handleFocus = async () => {
      if (!isLoggedOn || CC98SignalR.isConnecting) return;

      setLocalStorage("signalr", Date.now());
      await CC98SignalR.start();
      addMessageHandlers();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [addMessageHandlers, isLoggedOn]);

  React.useEffect(() => {
    if (typeof Notification !== "undefined") {
      void Notification.requestPermission();
    }
  }, []);

  React.useEffect(() => {
    if (BlinkTitle.haveUnreadCount(messageCount)) {
      BlinkTitle.start();
    }
  }, [messageCount]);

  return null;
}
