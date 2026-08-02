import type { PostInfo, UserRecentPost } from "../model/types";
import type { ResultWithCount } from "@foundation/api/contracts";
import { getBoardName } from "@modules/board";
import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

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
  const posts: UserRecentPost[] = (
    hasMore ? rawPosts.slice(0, 10) : rawPosts
  ).map((post) => ({ ...post, boardName: "" }));

  for (let index = posts.length; index--;) {
    posts[index].boardName = await getBoardName(posts[index].boardId);
  }

  return {
    posts,
    hasMore,
    totalPage: Math.floor(data.count / 10) + 1,
  };
}
