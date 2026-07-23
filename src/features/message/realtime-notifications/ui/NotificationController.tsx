import * as React from "react";

import { Actions, useAppDispatch, useAppSelector } from "@app/store";
import { navigate } from "@app/router/navigation";
import { refreshCurrentMessageCount } from "@legacy/AsyncActions/Message";
import type { MessageInfo } from "@legacy/Reducers/Message";
import { CC98SignalR } from "@legacy/SignalR";
import { setLocalStorage } from "@shared/storage/web-storage";
import { BlinkTitle } from "../../title-blinker";

const messageEvents = [
  "NotifyMessageReceive",
  "NotifyNotificationReceive",
] as const;

const parseStoredMessageCount = (value: string): MessageInfo =>
  JSON.parse(value.slice(4)) as MessageInfo;

export function NotificationController() {
  const dispatch = useAppDispatch();
  const isLoggedOn = useAppSelector((state) => state.userInfo.isLogOn);
  const messageCount = useAppSelector((state) => state.message);

  const handleNotifyMessageReceive = React.useCallback(() => {
    void dispatch(refreshCurrentMessageCount() as any);

    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      const notification = new Notification("您有一条新的消息", {
        icon: "/static/98icon.ico",
      });
      notification.onclick = () => {
        window.focus();
        void navigate("/message/response");
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
    void dispatch(refreshCurrentMessageCount() as any);

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
          Actions.changeMessageCount(
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
