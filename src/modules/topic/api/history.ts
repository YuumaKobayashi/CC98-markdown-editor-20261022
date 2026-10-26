import type {
  SearchedTopicInfo,
  TopicInfo,
  UserBrowsingTopicInfo,
} from "../model/dto";
import type { UserRecentTopic } from "../model/view-model";
import { toUserRecentTopic } from "../model/mappers";
import type { ResultWithCount } from "@foundation/api/contracts";
import { getToken, formAuthorizeHeader } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import { getBoardName } from "@modules/board/api/service";

export interface CurrentUserRecentTopicPage {
  topics: UserRecentTopic[];
  hasMore: boolean;
  totalPage: number;
}

export interface UserRecentTopicPage {
  topics: UserRecentTopic[];
  hasMore: boolean;
}

/**
 * 获取指定用户最近发表的主题。
 * 新接口直接返回总数，不再需要重复的 `userid` query 或多请求一条。
 */
export async function getUserRecentTopics(
  userId: number,
  from: number,
): Promise<UserRecentTopicPage> {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  const response = await cc98Fetch(
    `/user/${userId}/recent-topic-v3?from=${from}&size=10`,
    { headers },
  );
  if (response.status !== 200) throw new Error();

  const result = (await response.json()) as ResultWithCount<SearchedTopicInfo>;
  const rawTopics = result.data ?? [];
  return {
    topics: rawTopics.map((topic) => toUserRecentTopic(topic, topic.boardName)),
    hasMore: result.from + rawTopics.length < result.count,
  };
}

/**
 * 获取当前用户最近发表的主题。
 * 新接口直接返回总数，每页请求并展示 10 条。
 * @param page 当前页数
 * @author AsukaSong
 */
export async function getCurrentUserRecentTopics(
  page: number,
): Promise<CurrentUserRecentTopicPage> {
  console.log("请求最近发过的主题");
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(
    `/me/recent-topic-v2?from=${(page - 1) * 10}&size=10`,
    { headers },
  );

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const result = (await response.json()) as ResultWithCount<TopicInfo>;
  const rawTopics = result.data ?? [];
  const topics = new Array<UserRecentTopic>(rawTopics.length);

  for (let index = rawTopics.length; index--;) {
    const boardName = await getBoardName(rawTopics[index].boardId);
    topics[index] = toUserRecentTopic(rawTopics[index], boardName);
  }

  return {
    topics,
    hasMore: result.from + rawTopics.length < result.count,
    totalPage: Math.max(1, Math.ceil(result.count / 10)),
  };
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
  const response = await cc98Fetch(`/me/browsing-record?from=${from}&size=11`, {
    headers,
  });

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
