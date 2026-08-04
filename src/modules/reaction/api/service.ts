import { formAuthorizeHeader } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";
import { getTopic } from "@modules/topic/api/detail";
import type { PostLikeInfo } from "@modules/post/model/dto";

export async function like(
  topicid: number,
  postid: number,
): Promise<number | undefined> {
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

export async function dislike(
  topicid: number,
  postid: number,
): Promise<number | undefined> {
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

export async function refreshLikeState(
  topicId: number,
  postId: number,
): Promise<PostLikeInfo | undefined> {
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
    const data = (await response.json()) as PostLikeInfo;
    return data;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}
