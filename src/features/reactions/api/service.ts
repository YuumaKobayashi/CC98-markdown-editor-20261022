import { formAuthorizeHeader } from "@features/auth/api/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";
import { getTopic } from "@entities/topic/api/service";

export async function like(topicid, postid): Promise<number> {
  try {
    const headers = await formAuthorizeHeader();
    headers.append("Content-Type", "application/json");
    const content = "1";
    const response = await cc98Fetch(`/post/${postid}/like`, {
      method: "PUT",
      headers,
      body: content,
    });
    // if (response.status === 401) {
    //     throwLegacyError('UnauthorizedTopic');
    // }
    // if (response.status === 403) {
    //     // throwLegacyError('OperationForbidden');
    //     return
    // }
    // if (response.status === 404) {
    //     throwLegacyError('NotFoundTopic');
    // }
    // if (response.status === 500) {
    //     throwLegacyError('ServerError');
    // }
    // const data = await response.json();
    // return data;
    //console.info("like fetch " + response.status);
    return response.status;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function dislike(topicid, postid): Promise<number> {
  try {
    const headers = await formAuthorizeHeader();
    headers.append("Content-Type", "application/json");
    const content: string = "2";
    const response = await cc98Fetch(`/post/${postid}/like`, {
      method: "PUT",
      headers,
      body: content,
    });
    // if (response.status === 401) {
    //     throwLegacyError('UnauthorizedTopic');
    // }

    // if (response.status === 403) {
    //     // throwLegacyError('OperationForbidden');
    //     return
    // }
    // if (response.status === 404) {
    //     throwLegacyError('NotFoundTopic');
    // }
    // if (response.status === 500) {
    //     throwLegacyError('ServerError');
    // }
    // const data = await response.json();
    // return data;
    return response.status;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getLikeStateAndCount(topicid, postid) {
  try {
    const headers = await formAuthorizeHeader();

    const response = await cc98Fetch(`/post/${postid}/like`, { headers });
    if (response.status === 401) {
      throwLegacyError("UnauthorizedTopic");
    }

    if (response.status === 403) {
      throwLegacyError("OperationForbidden");
    }
    if (response.status === 404) {
      throwLegacyError("NotFoundTopic");
    }
    if (response.status === 500) {
      throwLegacyError("ServerError");
    }
    const data = await response.json();
    return data;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getLikeState(topicid) {
  try {
    const headers = await formAuthorizeHeader();
    const topic = await getTopic(topicid);
    const postId = topic.postId;
    const response = await cc98Fetch(`/post/${postId}/like`, { headers });
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
        throwLegacyError("NotFoundTopic");
      case 500:
        throwLegacyError("ServerError");
    }
    const data = await response.json();
    return data;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function refreshLikeState(topicId, postId) {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(`/post/${postId}/like`, { headers });
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
        throwLegacyError("NotFoundTopic");
      case 500:
        throwLegacyError("ServerError");
    }
    const data = await response.json();
    return data;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function awardWealth(reason, value, postId) {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const body = {
    operationType: 0,
    reason: reason,
    wealth: value,
  };
  const str = JSON.stringify(body);
  const url = `/post/${postId}/operation`;
  if (value) {
    const response = await cc98Fetch(url, {
      method: "POST",
      headers,
      body: str,
    });
    switch (response.status) {
      case 400:
        if ((await response.text()) === "reward_wealth_limited")
          return "limited";
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

export async function deductWealth(reason, value, postId) {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const body = {
    operationType: 1,
    reason: reason,
    wealth: value,
  };
  const str = JSON.stringify(body);
  const url = `/post/${postId}/operation`;
  if (value != 0) {
    const response = await cc98Fetch(url, {
      method: "POST",
      headers,
      body: str,
    });
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

export async function getAwardInfo(postId) {
  const headers = await formAuthorizeHeader();
  const url = `/post/${postId}/awards`;
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}
