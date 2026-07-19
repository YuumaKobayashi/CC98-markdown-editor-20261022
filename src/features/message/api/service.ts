import $ from "jquery";
import { formAuthorizeHeader } from "@features/auth/api/session";
import { cc98Fetch } from "@shared/api/http";
import { clearLegacyMessageCounts, getLegacyMessageCounts, throwLegacyError } from "@shared/lib/legacy-utility-effects";

/**
 * 发送私信的函数
 * @param bodyContent
 */
export async function sendMessage(bodyContent: string) {
  const myHeaders = await formAuthorizeHeader();
  myHeaders.append("content-type", "application/json");
  let response = await cc98Fetch("/message", {
    method: "POST",
    headers: myHeaders,
    body: bodyContent,
  });
  if (response.status === 401) {
    throwLegacyError("LogOut");
  }
  if (response.status === 500) {
    throwLegacyError("ServerError");
  }
  return response;
}

/**
 * 一键已读
 */
export async function readAll() {
  let path = location.pathname;
  let url = null;
  let unreadCount = getLegacyMessageCounts();
  const headers = await formAuthorizeHeader();
  if (path === "/message/response") {
    if (unreadCount.replyCount === 0) {
      return null;
    }
    url = "/notification/read-all-reply";
  } else if (path === "/message/attme") {
    if (unreadCount.atCount === 0) {
      return null;
    }
    url = "/notification/read-all-at";
  } else if (path === "/message/system") {
    if (unreadCount.systemCount === 0) {
      return null;
    }
    url = "/notification/read-all-system";
  } else if (path === "/message") {
    if (unreadCount.replyCount === 0) {
      return null;
    }
    url = "/notification/read-all-reply";
  } else {
    return null;
  }
  const response = await cc98Fetch(url, { method: "PUT", headers, body: "" });
  clearLegacyMessageCounts();
  return null;
}

/**
 * 控制提示消息出现和消失
 */
export function noticeMessageShow(id: string) {
  $(`#${id}`).removeClass("displaynone");
  $(`#${id}`).removeClass("noticeDisplaynone");
  setTimeout(function () {
    $(`#${id}`).addClass("noticeDisplaynone");
  }, 1);
}
