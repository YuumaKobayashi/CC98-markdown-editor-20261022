import type { PostInfo } from "../model/dto";
import type { UserRecentPost } from "../model/view-model";
import { toUserRecentPost } from "../model/mappers";
import type { ResultWithCount } from "@foundation/api/contracts";
import { getBoardName } from "@modules/board/api/service";
import { formAuthorizeHeader } from "@modules/session/api/session";
import { getToken } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";

export async function getShortTopic(
  topicId: number,
): Promise<PostInfo[] | "not found" | "server error"> {
  const headers = await formAuthorizeHeader();
  const url = `/topic/${topicId}/post?from=0&size=10`;
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return (await response.json()) as PostInfo[];
}

export async function getOriginalEditorPost(
  postId: number | string,
  currentToken?: string,
): Promise<Response> {
  const token = currentToken || (await getToken());
  const headers = new Headers();
  headers.append("Authorization", token);
  return cc98Fetch(`/post/${postId}/original`, { headers });
}

export interface CurrentUserRecentPostPage {
  posts: UserRecentPost[];
  hasMore: boolean;
  totalPage: number;
}

/**
 * 获取当前用户最近或热门的回复。
 * 接口通过多请求一条来探测是否还有下一页，页面仍只展示前 10 条。
 * @param page 当前页数
 * @author AsukaSong
 */
export async function getCurrentUserRecentPosts(
  page: number,
  isHot: 0 | 1,
): Promise<CurrentUserRecentPostPage> {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(
    `/me/${isHot === 0 ? "recent" : "hot"}-post?from=${(page - 1) * 10}&size=11`,
    { headers },
  );

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const data = (await response.json()) as ResultWithCount<PostInfo>;
  const rawPosts = data.data!;
  const hasMore = rawPosts.length === 11;
  const rawVisiblePosts = hasMore ? rawPosts.slice(0, 10) : rawPosts;
  const posts = new Array<UserRecentPost>(rawVisiblePosts.length);

  for (let index = rawVisiblePosts.length; index--;) {
    const boardName = await getBoardName(rawVisiblePosts[index].boardId);
    posts[index] = toUserRecentPost(rawVisiblePosts[index], boardName);
  }

  return {
    posts,
    hasMore,
    totalPage: Math.floor(data.count / 10) + 1,
  };
}
