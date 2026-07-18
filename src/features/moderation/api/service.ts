import $ from "jquery";
import { formAuthorizeHeader } from "@features/auth/api/session";
import { cc98Fetch } from "@shared/api/http";

/**
 * 风评接口v1.0
 */
export async function plus1(topicId, postId, reason) {
  const url = `/post/${postId}/rating`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = { value: 1, reason: reason };
  const body = JSON.stringify(bodyinfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });

  switch (response.status) {
    case 400:
      return "rateself";
    case 401:
      return "not allowed";
    case 403:
      // if (await response.text() === 'you_cannot_rate')
      //     return 'not allowed';
      // else
      return "already";
    case 500:
      return "server error";
  }
  return "ok";
}

/**
 * 风评接口v1.0
 * */
export async function minus1(topicId, postId, reason) {
  const url = `/post/${postId}/rating`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = { value: -1, reason: reason };
  const body = JSON.stringify(bodyinfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  switch (response.status) {
    case 400:
      return "rateself";
    case 401:
      return "not allowed";
    case 403:
      // if (await response.text() === 'you_cannot_rate')
      //     return 'not allowed';
      // else
      return "already";
    case 500:
      return "server error";
  }
  return "ok";
}

/**风评接口v2.0 */
export async function positiveJudge(postId, reasonId, type) {
  const url = `/post/${postId}/rating-v2`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = { reasonId: reasonId, type: type };
  const body = JSON.stringify(bodyinfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  //如果状态码不存在或者500，返回服务器错误
  if (!response.status || response.status === 500) {
    return "server error";
  }
  //如果状态码是40x，返回对应的错误
  if (response.status >= 400 && response.status < 500) {
    return await response.text();
  }
  return "ok";
}

export async function negativeJudge(postId, reasonId, type) {
  const url = `/post/${postId}/rating-v2`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = { reasonId: reasonId, type: type };
  const body = JSON.stringify(bodyinfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  //如果状态码不存在或者500，返回服务器错误
  if (!response.status || response.status === 500) {
    return "server error";
  }
  //如果状态码是40x，返回对应的错误
  if (response.status >= 400 && response.status < 500) {
    return await response.text();
  }
  return "ok";
}

export async function addPrestige(postId, value, reason) {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = { operationType: 0, prestige: value, reason: reason };
  const url = `/post/${postId}/operation`;
  const body = JSON.stringify(bodyinfo);
  if (value) {
    const response = await cc98Fetch(url, { method: "POST", headers, body });
    switch (response.status) {
      case 400:
        return "wrong input";
      case 401:
        return "unauthorized";
      case 404:
        return "not found";
      case 500:
        return "server error";
    }
  }
  return "ok";
}

export async function deductPrestige(postId, value, reason) {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = { operationType: 1, prestige: value, reason: reason };
  const url = `/post/${postId}/operation`;
  const body = JSON.stringify(bodyinfo);
  if (value) {
    const response = await cc98Fetch(url, { method: "POST", headers, body });
    switch (response.status) {
      case 400:
        return "wrong input";
      case 401:
        return "unauthorized";
      case 404:
        return "not found";
      case 500:
        return "server error";
    }
  }
  return "ok";
}

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
  const bodyinfo = { operationType: 1, reason: reason, stopPostDays: days };
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
  topState,
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

//获取特定类型的消息的总数，1为回复消息，2为@消息，3为系统消息

export async function getTotalPage(type: number) {
  const headers = await formAuthorizeHeader();

  let response = await cc98Fetch("/me/all-message-count", { headers });

  let totalPage = await response.json();
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

export async function mutliLock(day, reason, target) {
  const url = `/topic/multi-lock?${target}`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify({
    reason: reason,
    value: day,
  });
  $("#mutlilock-btn").attr("disabled", "disabled");
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  if (response.status == 200) {
    $("#mutlilock-btn").removeAttr("disabled");
    $("#mutlioptip").text("操作成功");
  } else {
    $("#mutlilock-btn").removeAttr("disabled");
    $("#mutlioptip").text("操作失败");
  }
  return response.status;
}

export async function mutliDelete(reason, target) {
  const url = `/topic/multi-delete?${target}`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify({
    reason: reason,
  });
  $("#mutlidelete-btn").attr("disabled", "disabled");
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  if (response.status == 200) {
    $("#mutlidelete-btn").removeAttr("disabled");
    $("#mutliopdtip").text("操作成功");
  } else {
    $("#mutlidelete-btn").removeAttr("disabled");
    $("#mutliopdtip").text("操作失败");
  }
  return response.status;
}

export async function getManageHistory(topicId, from) {
  const url = `/topic/${topicId}/event?from=${from}&size=7`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return await response.json();
}

/**
 * 获取可用的风评标签
 */
export async function getJudgeTags(type: number) {
  const url = `/post/rating-reason?type=${type}`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return await response.json();
}
