import type {
  SearchedTopicInfo,
  TopicInfo,
  UserBrowsingTopicInfo,
} from "../model/dto";
import type { UserRecentTopic } from "../model/view-model";
import { toUserRecentTopic } from "../model/mappers";
import type { ResultWithCount } from "@foundation/api/contracts";
import {
  getToken,
  formAuthorizeHeader,
} from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import { getBoardName } from "@modules/board/api/service";

export interface CurrentUserRecentTopicPage {
  topics: UserRecentTopic[];
  hasMore: boolean;
}

/**
 * 获取指定用户最近发表的主题。
 * 旧接口仍保留重复的 `userid` query，并通过多请求一条判断是否还有下一页。
 */
export async function getUserRecentTopics(
  userId: number,
  from: number,
): Promise<UserRecentTopic[]> {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  const response = await cc98Fetch(
    `/user/${userId}/recent-topic?userid=${userId}&from=${from}&size=11`,
    { headers },
  );
  if (response.status !== 200) throw new Error();

  const topics = (await response.json()) as SearchedTopicInfo[];
  return topics.map((topic) => toUserRecentTopic(topic, topic.boardName));
}

/**
 * 获取当前用户最近发表的主题。
 * 接口通过多请求一条来探测是否还有下一页，页面仍只展示前 10 条。
 * @param page 当前页数
 * @author AsukaSong
 */
export async function getCurrentUserRecentTopics(
  page: number,
): Promise<CurrentUserRecentTopicPage> {
  console.log("请求最近发过的主题");
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(
    `/me/recent-topic?from=${(page - 1) * 10}&size=11`,
    { headers },
  );

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const result = (await response.json()) as TopicInfo[];
  const hasMore = result.length === 11;
  const rawTopics = hasMore ? result.slice(0, 10) : result;
  const topics = new Array<UserRecentTopic>(rawTopics.length);

  for (let index = rawTopics.length; index--;) {
    const boardName = await getBoardName(rawTopics[index].boardId);
    topics[index] = toUserRecentTopic(rawTopics[index], boardName);
  }

  return { topics, hasMore };
}

export interface CurrentUserBrowsingHistoryPage {
  topics: UserRecentTopic[];
  totalPage?: number;
}

/**
 * 获取当前用户的主题浏览历史。
 * 接口请求 11 条记录，页面仍只展示前 10 条。
 * @param page 当前页数
 * @author XSYangtuo
 */
export async function getCurrentUserBrowsingHistory(
  page: number,
): Promise<CurrentUserBrowsingHistoryPage> {
  console.log("getHistoryPosts", page, true);
  const from = (page - 1) * 10;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(
    `/me/browsing-record?from=${from}&size=11`,
    { headers },
  );

  if (response.status === 403) {
    alert("你刷新的太快啦！可以晚些刷新");
  }
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const result =
    (await response.json()) as ResultWithCount<UserBrowsingTopicInfo> | null;
  const rawTopics = result?.data;

  if (!rawTopics || rawTopics.length === 0) {
    console.log("no posts");
    return { topics: [] };
  }

  const topics = rawTopics.map((topic) =>
    toUserRecentTopic(topic, topic.boardName),
  );

  if (topics.length !== 11) {
    console.log("total loaded");
    return { topics, totalPage: page };
  }

  return {
    topics,
    totalPage: Math.ceil((result?.count as number) / 10) || page + 1,
  };
}
