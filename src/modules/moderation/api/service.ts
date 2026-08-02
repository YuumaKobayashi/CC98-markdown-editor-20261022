import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { PostUserOperationType } from "@modules/post";
import type { TopicTopState } from "@modules/topic";

export async function deletePost(topicId, postId, reason) {
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

export async function stopBoardPost(postId, reason, days) {
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

export async function cancelStopBoardPost(userId, boardId) {
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
  topicId,
  boardId,
  topState: TopicTopState,
  days,
  reason
) {
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

export async function removeBoardTopTopic(topicId, boardId, reason) {
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

export async function deleteTopic(topicId, reason) {
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

export async function lockTopic(topicId, boardId, reason, days) {
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

export async function upTopic(topicId, boardId, reason) {
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

export async function unLockTopic(topicId, boardId, reason) {
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

export async function setBestTopic(topicId, reason) {
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

export async function cancelBestTopic(topicId, reason) {
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

export async function setDisableHot(topicId, reason) {
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

export async function cancelDisableHot(topicId, reason) {
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
  topicId,
  isBold,
  isItalic,
  color,
  duration,
  reason
) {
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

export async function findIP(topicId) {
  const url = `/topic/${topicId}/look-ip`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  if (response.status === 200) return await response.json();
  else return [];
}

export async function moveTopic(topicId, boardId, reason) {
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

export async function getManageHistory(topicId, from) {
  const url = `/topic/${topicId}/event?from=${from}&size=7`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return await response.json();
}
