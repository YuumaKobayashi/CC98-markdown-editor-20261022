import { formAuthorizeHeader } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import type { UserRecentTopic } from "@modules/topic/model/view-model";
import type { ResultWithCount } from "@foundation/api/contracts";
import {
  FavoriteTopicOrder,
  type FavoriteTopicGroup,
} from "../model/favorite-topic-group";

export interface CurrentUserFavoriteTopicPage {
  topics: UserRecentTopic[];
  hasMore: boolean;
}

// export async function setFavoriteTopic(topicId) {
//   const headers = await formAuthorizeHeader();
//   const url = `/me/favorite/${topicId}`;
//   const reponse = await cc98Fetch(url, { method: "PUT", headers });
//   return "ok";
// }
//PUT 收藏帖子
export async function setFavoriteTopic(
  topicId: number,
  groupId: number = 0,
): Promise<"ok"> {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite/${topicId}?groupid=${groupId}`;
  const reponse = await cc98Fetch(url, { method: "PUT", headers });
  return "ok";
}

export async function getFavoriteAllTopic(): Promise<
  ResultWithCount<FavoriteTopicGroup>
> {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite-topic-group`
  const response = await cc98Fetch(url, { headers });
  const data = (await response.json()) as ResultWithCount<FavoriteTopicGroup>;
  return data;
}

/**
 * 获取当前用户收藏的主题。
 * 接口通过多请求一条来探测是否还有下一页，页面仍只展示前 10 条。
 * @param page 当前页数
 * @author AsukaSong
 */
export async function getCurrentUserFavoriteTopics(
  page: number,
  order: FavoriteTopicOrder = FavoriteTopicOrder.PostTime,
  group: number = 0,
  keyword: string = "",
): Promise<CurrentUserFavoriteTopicPage> {
  const from = (page - 1) * 10;
  const url = keyword
    ? `/topic/me/search-favorite?from=${from}&size=11&keyword=${keyword}`
    : `/topic/me/favorite?from=${from}&size=11&order=${order}&groupid=${group}`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const result = (await response.json()) as UserRecentTopic[];
  const hasMore = result.length === 11;
  const topics = hasMore ? result.slice(0, 10) : result;

  return { topics, hasMore };
}

export async function deleteFavoriteTopic(topicId: number): Promise<"ok"> {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite/${topicId}`;
  const reponse = await cc98Fetch(url, { method: "DELETE", headers });
  return "ok";
}

export async function getFavState(
  topicId: number | string,
): Promise<boolean> {
  const headers = await formAuthorizeHeader();
  const url = `/topic/${topicId}/isfavorite`;
  const response = await cc98Fetch(url, { headers });
  const data = (await response.json()) as boolean;
  return data;
}

//创建收藏夹
export async function createFavGroup(
  groupName: string,
): Promise<"ok" | "error"> {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite-topic-group`;
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: groupName }),
  });
  if (response.status === 200) return "ok";
  else return "error";
}

//修改收藏夹名称
export async function updateFavGroup(
  groupId: number,
  groupName: string,
): Promise<"ok" | "error"> {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite-topic-group/`;
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({ id: groupId, name: groupName }),
  });
  if (response.status === 200) return "ok";
  else return "error";
}

//删除收藏夹
export async function deleteFavGroup(
  groupId: number,
): Promise<"ok" | "error"> {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite-topic-group?groupid=${groupId}`;
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method: "DELETE",
    headers,
  });
  if (response.status === 200) return "ok";
  else return "error";
}
