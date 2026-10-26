import { formAuthorizeHeader } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import {
  PostUserOperationType,
  RatingType,
} from "@modules/post/model/dto";
import type { RatingReason } from "../model/dto";

export type PostOperationResult =
  | "ok"
  | "limited"
  | "wrong input"
  | "unauthorized"
  | "not found"
  | "server error";

export async function awardWealth(
  reason: string,
  value: number,
  postId: number,
): Promise<PostOperationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const body = {
    operationType: PostUserOperationType.Bonus,
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

export async function deductWealth(
  reason: string,
  value: number,
  postId: number,
): Promise<PostOperationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const body = {
    operationType: PostUserOperationType.Punishment,
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
export async function positiveJudge(
  postId: number,
  reasonId: number,
  type: RatingType,
): Promise<string> {
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

export async function negativeJudge(
  postId: number,
  reasonId: number,
  type: RatingType,
): Promise<string> {
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

export async function addPrestige(
  postId: number,
  value: number,
  reason: string,
): Promise<PostOperationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = {
    operationType: PostUserOperationType.Bonus,
    prestige: value,
    reason: reason,
  };
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

export async function deductPrestige(
  postId: number,
  value: number,
  reason: string,
): Promise<PostOperationResult> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const bodyinfo = {
    operationType: PostUserOperationType.Punishment,
    prestige: value,
    reason: reason,
  };
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

/**
 * 获取可用的风评标签
 */
export async function getJudgeTags(type: RatingType): Promise<RatingReason[]> {
  const url = `/post/rating-reason?type=${type}`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return (await response.json()) as RatingReason[];
}
