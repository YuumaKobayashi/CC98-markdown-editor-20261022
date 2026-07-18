import {
  getLegacyMessageCounts,
  LegacyMessageCounts,
} from "@shared/lib/legacy-utility-effects";

export namespace BlinkTitle {
  let title: string;
  let timer: number;

  export function haveUnreadCount(
    message: LegacyMessageCounts = getLegacyMessageCounts()
  ): boolean {
    const totalCount =
      message.atCount +
      message.messageCount +
      message.replyCount +
      message.systemCount;
    return totalCount !== 0;
  }

  function stop(): void {
    document.title = title;
    clearInterval(timer);
  }

  export function start(): void {
    if (!haveUnreadCount()) return;
    title = document.title;
    document.title = "【收到新消息】" + title;

    timer = window.setInterval(() => {
      if (!haveUnreadCount()) {
        stop();
        return;
      }

      if (document.title.indexOf("【收到新消息】") === 0) {
        document.title = title;
      } else {
        title = document.title;
        document.title = "【收到新消息】" + title;
      }
    }, 1000);
  }
}
