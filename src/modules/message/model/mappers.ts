import { transerTime } from "@foundation/lib/time";
import type { MessageInfo, RecentContactUserInfo } from "./dto";
import type { MessagePersonInfo, MessageViewModel } from "./view-model";
import type { UserBasicInfo, UserLookupFallback } from "@modules/user";

/**
 * 处理最新消息列表，时间间隔短的消息只显示第一条消息的时间
 * @param recentMessage
 */
export function toMessageViewModels(
  recentMessage: readonly MessageInfo[],
): MessageViewModel[] {
  return recentMessage.map((message, index) => {
    let showTime: boolean;
    if (index + 1 === recentMessage.length) {
      showTime = true;
    } else if (
      transerTime(message.time) -
        transerTime(recentMessage[index + 1].time) <
      60000
    ) {
      showTime = false;
    } else {
      showTime = true;
    }

    return { ...message, showTime };
  });
}

export function toMessagePersonInfo(
  user: Readonly<UserBasicInfo | UserLookupFallback>,
  contact: Readonly<RecentContactUserInfo>,
): MessagePersonInfo {
  return {
    id: user.id ?? contact.userId,
    name: user.name,
    portraitUrl: user.portraitUrl,
    message: [],
    lastContent: contact.lastContent,
    isRead: contact.isRead,
  };
}
