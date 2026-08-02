import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { PostUserOperationType } from "@modules/post";
import type { TopicTopState } from "@modules/topic";
import type {
  ModerationResult,
  PostWithIpInfo,
  TopicManageHistory,
} from "../model/types";

export async function deletePost(
  topicId: number,
  postId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = { reason: reason };
  const url = `/post/${postId}`;
  const response = await cc98Fetch(url, {
    method: "DELETE",
    headers,
    body: JSON.stringify(bodyinfo),
  });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function stopBoardPost(
  postId: number,
  reason: string,
  days: number,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = {
    operationType: PostUserOperationType.Punishment,
    reason: reason,
    stopPostDays: days,
  };
  const url = `/post/${postId}/operation`;
  const response = await cc98Fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(bodyinfo),
  });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function cancelStopBoardPost(
  userId: number,
  boardId: number,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/board/${boardId}/stop-post-user/${userId}`;
  const response = await cc98Fetch(url, { method: "DELETE", headers });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function addBoardTopTopic(
  topicId: number,
  boardId: number,
  topState: TopicTopState,
  days: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const content = { topState: topState, duration: days, reason: reason };
  const response = await cc98Fetch(`/topic/${topicId}/top`, {
    method: "PUT",
    headers,
    body: JSON.stringify(content),
  });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function removeBoardTopTopic(
  topicId: number,
  boardId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const content = { reason: reason };
  const response = await cc98Fetch(`/topic/${topicId}/top`, {
    method: "DELETE",
    headers,
    body: JSON.stringify(content),
  });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function deleteTopic(
  topicId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}`;
  const bodyInfo = { reason: reason };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "DELETE", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function lockTopic(
  topicId: number,
  boardId: number,
  reason: string,
  days: number,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}/lock`;
  const bodyInfo = { reason: reason, value: days };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function upTopic(
  topicId: number,
  boardId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}/up`;
  const bodyInfo = { reason: reason };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function unLockTopic(
  topicId: number,
  boardId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}/lock`;
  const bodyInfo = { reason: reason };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "DELETE", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function setBestTopic(
  topicId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}/best`;
  const bodyInfo = { reason: reason };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function cancelBestTopic(
  topicId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}/best`;
  const bodyInfo = { reason: reason };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "DELETE", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function setDisableHot(
  topicId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}/not-hot`;
  const bodyInfo = { reason: reason };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function cancelDisableHot(
  topicId: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}/not-hot`;
  const bodyInfo = { reason: reason };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "DELETE", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function setHighlight(
  topicId: number,
  isBold: boolean,
  isItalic: boolean,
  color: string,
  duration: number,
  reason: string,
): Promise<ModerationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/topic/${topicId}/highlight`;
  const bodyInfo = {
    isBold: isBold,
    isItalic: isItalic,
    color: color,
    duration: duration,
    reason: reason,
  };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  switch (response.status) {
    case 401:
      return "unauthorized";
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return "ok";
}

export async function findIP(topicId: number): Promise<PostWithIpInfo[]> {
  const url = `/topic/${topicId}/look-ip`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  if (response.status === 200)
    return (await response.json()) as PostWithIpInfo[];
  else return [];
}

export async function moveTopic(
  topicId: number,
  boardId: number,
  reason: string,
): Promise<"ok" | "error"> {
  const url = `/topic/${topicId}/moveto/${boardId}`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({ reason }),
  });
  if (response.status === 200) return "ok";
  else return "error";
}

export async function getManageHistory(
  topicId: number,
  from: number,
): Promise<TopicManageHistory> {
  const url = `/topic/${topicId}/event?from=${from}&size=7`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return (await response.json()) as TopicManageHistory;
}
