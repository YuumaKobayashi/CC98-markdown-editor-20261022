import $ from "jquery";
export { noticeMessageShow } from "@foundation/ui/feedback";
import { getToken, formAuthorizeHeader, isLogOn } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { clearLegacyMessageCounts, getLegacyMessageCounts, throwLegacyError } from "@foundation/lib/legacy-utility-effects";
import { getBoardName } from "@modules/board";
import { getBasicTopicsInfo, getThisTopicInfo } from "@modules/topic";
import type {
  ReplyAtNotificationInfo,
  ReplyAtNotificationViewModel,
  SystemNotificationInfo,
  SystemNotificationViewModel,
} from "../model/types";
import type { UnreadCount } from "../model/dto";

//获取特定类型的消息的总数，1为回复消息，2为@消息，3为系统消息
//TODO:禁止magic number，改为枚举
export type NotificationPageSection = 1 | 2 | 3;

export async function getUnreadCount(headers: Headers): Promise<UnreadCount> {
  const response = await cc98Fetch("/me/unread-count", { headers });
  return (await response.json()) as UnreadCount;
}

export async function getTotalPage(
  type: NotificationPageSection,
): Promise<number | undefined> {
  const headers = await formAuthorizeHeader();

  let response = await cc98Fetch("/me/all-message-count", { headers });

  const totalPage = (await response.json()) as UnreadCount;
  switch (type) {
    case 1:
      return totalPage.replyCount;

    case 2:
      return totalPage.atCount;

    case 3:
      return totalPage.systemCount;

    default:
      break;
  }
}

/**
 * 获取系统通知
 * @param from 获取消息起点
 * @param size 一次性获取消息数量
 */
export async function getMessageSystem(
  from: number,
  size: number
): Promise<SystemNotificationViewModel[] | null> {
  const myHeaders = await formAuthorizeHeader();
  try {
    let response = await cc98Fetch(
      `/notification/system?from=${from}&size=${size}`,
      { headers: myHeaders }
    );
    switch (response.status) {
      case 401:
        //如果未登录,直接返回未登录
        if (!isLogOn()) {
          throwLegacyError("LogOut");
          return null;
        } else {
          throwLegacyError("UnauthorizedTopic");
          return null;
        }
      case 403:
        throwLegacyError("OperationForbidden");
        return null;
      case 404:
        throwLegacyError("NotFoundTopic");
        return null;
      case 500:
        throwLegacyError("ServerError");
        return null;
    }
    var newTopic = (await response.json()) as SystemNotificationInfo[]; //先从api得到原始的系统消息数据
  } catch {
    return [];
  }

  //补充楼层信息
  for (let i in newTopic) {
    if (newTopic[i].postId) {
      (newTopic[i] as SystemNotificationViewModel).floor =
        newTopic[i].postBasicInfo!.floor;
    } else {
      (newTopic[i] as SystemNotificationViewModel).floor = 0;
    }
  }
  //console.log("返回前数据", newTopic);
  return newTopic as SystemNotificationViewModel[];
}

//获取回复我的通知
export async function getMessageResponse(
  from: number,
  size: number
): Promise<ReplyAtNotificationViewModel[] | undefined> {
  try {
    let result: ReplyAtNotificationViewModel[] = [];
    const myHeaders = await formAuthorizeHeader();

    let response = await cc98Fetch(
      `/notification/reply?from=${from}&size=${size}`,
      { headers: myHeaders }
    );
    switch (response.status) {
      case 401:
        //如果未登录,直接返回未登录
        if (!isLogOn()) {
          throwLegacyError("LogOut");
          return [];
        } else {
          throwLegacyError("UnauthorizedTopic");
          return [];
        }
      case 403:
        throwLegacyError("OperationForbidden");
        return [];
      case 404:
        throwLegacyError("NotFoundTopic");
        return [];
      case 500:
        throwLegacyError("ServerError");
        return [];
    }
    let newTopic = (await response.json()) as ReplyAtNotificationInfo[];
    //把postId、topicId分别统计存到一个数组里，然后批量查询一下
    let topicsId = [];
    for (let item of newTopic) {
      if (item.topicId) {
        topicsId.push(item.topicId);
      }
    }
    let topicsInfo = await getBasicTopicsInfo(topicsId);
    //补充帖子标题，版面id和版面名称信息
    if (newTopic) {
      for (let i in newTopic) {
        const viewTopic = newTopic[i] as ReplyAtNotificationViewModel;
        if (newTopic[i].topicId) {
          let topicInfo = getThisTopicInfo(newTopic[i].topicId, topicsInfo);
          viewTopic.topicTitle = topicInfo.title;
          newTopic[i].boardId = topicInfo.boardId;
          viewTopic.boardName = await getBoardName(newTopic[i].boardId);
        }
        //获取楼层信息和回复者信息
        if (newTopic[i].postId) {
          viewTopic.floor = newTopic[i].postBasicInfo!.floor;
          viewTopic.userId = newTopic[i].postBasicInfo!.userId;
          viewTopic.userName = newTopic[i].postBasicInfo!.userName;
        } else {
          viewTopic.floor = 1;
          viewTopic.userId = -1;
          viewTopic.userName = "有人";
        }
        result.push(viewTopic);
      }
    }
    return result;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

//获取@我的通知
export async function getMessageAttme(
  from: number,
  size: number
): Promise<ReplyAtNotificationViewModel[] | undefined> {
  try {
    let result: ReplyAtNotificationViewModel[] = [];
    let token = await getToken();
    let myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    let response = await cc98Fetch(
      `/notification/at?from=${from}&size=${size}`,
      { headers: myHeaders }
    );
    switch (response.status) {
      case 401:
        //如果未登录,直接返回未登录
        if (!isLogOn()) {
          throwLegacyError("LogOut");
          return [];
        } else {
          throwLegacyError("UnauthorizedTopic");
          return [];
        }
      case 403:
        throwLegacyError("OperationForbidden");
        return [];
      case 404:
        throwLegacyError("NotFoundTopic");
        return [];
      case 500:
        throwLegacyError("ServerError");
        return [];
    }
    let newTopic = (await response.json()) as ReplyAtNotificationInfo[];
    //console.log("获取到的新@数据", newTopic);
    //把postId、topicId分别统计存到一个数组里，然后批量查询一下
    let topicsId = [];
    for (let item of newTopic) {
      if (item.topicId) {
        topicsId.push(item.topicId);
      }
    }
    let topicsInfo = await getBasicTopicsInfo(topicsId);
    //补充帖子标题，版面id和版面名称信息
    if (newTopic) {
      for (let i in newTopic) {
        const viewTopic = newTopic[i] as ReplyAtNotificationViewModel;
        if (newTopic[i].topicId) {
          let topicInfo = getThisTopicInfo(newTopic[i].topicId, topicsInfo);
          viewTopic.topicTitle = topicInfo.title;
          newTopic[i].boardId = topicInfo.boardId;
          viewTopic.boardName = await getBoardName(newTopic[i].boardId);
        }
        //获取楼层信息和回复者信息
        if (newTopic[i].postId) {
          viewTopic.floor = newTopic[i].postBasicInfo!.floor;
          viewTopic.userId = newTopic[i].postBasicInfo!.userId;
          viewTopic.userName = newTopic[i].postBasicInfo!.userName;
        } else {
          viewTopic.floor = 1;
          viewTopic.userId = -1;
          viewTopic.userName = "有人";
        }
        result.push(viewTopic);
      }
    }
    return result;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

/**
 * 一键已读
 */
export type ReadAllNotificationSection = "reply" | "at" | "system";

export async function readAll(
  section: ReadAllNotificationSection | null,
): Promise<null> {
  let url = null;
  let unreadCount = getLegacyMessageCounts();
  const headers = await formAuthorizeHeader();
  if (section === "reply") {
    if (unreadCount.replyCount === 0) {
      return null;
    }
    url = "/notification/read-all-reply";
  } else if (section === "at") {
    if (unreadCount.atCount === 0) {
      return null;
    }
    url = "/notification/read-all-at";
  } else if (section === "system") {
    if (unreadCount.systemCount === 0) {
      return null;
    }
    url = "/notification/read-all-system";
  } else {
    return null;
  }
  const response = await cc98Fetch(url, { method: "PUT", headers, body: "" });
  clearLegacyMessageCounts();
  return null;
}
