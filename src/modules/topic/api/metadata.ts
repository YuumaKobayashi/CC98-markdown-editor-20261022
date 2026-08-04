import type { TopicBasicLookupFallback } from "../model/types";
import type { ITag, TopicBasicInfo, TopicInfo } from "../model/dto";
import type { PostBasicInfo } from "@modules/post/model/dto";
import { readTagInfoCache, writeTagInfoCache } from "../cache/tag-cache";
import {
  formAuthorizeHeader,
  isLogOn,
} from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";

export async function getTopicInfo(
  topicId: number,
): Promise<TopicInfo | null> {
  const headers = await formAuthorizeHeader();
  const url = `/topic/${topicId}`;
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 401:
      //如果未登录,直接返回未登录
      if (!isLogOn()) {
        throwLegacyError("LogOut");
        return null;
      } else {
        throwLegacyError("UnauthorizedTopic");
        return null;
      }
    case 403:
      throwLegacyError("OperationForbidden");
      return null;
    case 404:
      throwLegacyError("NotFoundTopic");
      return null;
    case 500:
      throwLegacyError("ServerError");
      return null;
  }

  const data = (await response.json()) as TopicInfo;
  return data;
}

export async function getPostInfo(postId: number) {
  const headers = await formAuthorizeHeader();
  const url = `/post/basic?id=${postId}`;
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 404:
      return "not found";
    case 500:
      return "server error";
  }

  const data = (await response.json()) as PostBasicInfo[] & {
    canEntry?: boolean;
  };
  if (data.canEntry === false) {
    return "unauthorized";
  }
  return data[0];
}

export async function getTagInfo(): Promise<ITag[]> {
  const tagInfo = readTagInfoCache<ITag[]>();
  if (tagInfo) {
    return tagInfo;
  } else {
    return await getNewTagInfo();
  }
}

export async function getNewTagInfo(): Promise<ITag[]> {
  const url = `/config/global/alltag`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  const data = (await response.json()) as ITag[];
  writeTagInfoCache(data);
  return data;
}

export async function getTagIdbyName(
  name: string,
): Promise<number | false> {
  const tagInfo = await getTagInfo();
  for (let item of tagInfo) {
    if (item.name === name) return item.id;
  }
  const newTagInfo = await getNewTagInfo();
  for (let item of newTagInfo) {
    if (item.name === name) return item.id;
  }
  return false;
}

export async function getTagNamebyId(
  id: number,
): Promise<string | false> {
  const tagInfo = await getTagInfo();
  for (let item of tagInfo) {
    if (item.id === id) return item.name;
  }
  return false;
}

//批量查询post的基础信息
export async function getBasicPostsInfo(postIds: number[]) {
  if (!postIds || postIds.length === 0) {
    return [];
  }
  const headers = await formAuthorizeHeader();
  let url = "/post/basic";
  for (let i = 0; i < postIds.length; i++) {
    if (i === 0) {
      url = `${url}?id=${postIds[i]}`;
    } else {
      url = `${url}&id=${postIds[i]}`;
    }
  }
  try {
    let response = await cc98Fetch(url, { headers });
    const data = (await response.json()) as PostBasicInfo[];
    return data;
  } catch (e) {
    return [];
  }
}

//在postsId中查询postId，查到了就返回对应的信息，没有就设置一个默认的,post信息包括楼层信息和回复者信息
export function getThisPostInfo(postId, postIds) {
  for (let i in postIds) {
    if (postIds[i].id === postId) {
      return postIds[i];
    }
  }
  //查询失败
  let indexData = {
    id: postId,
    floor: 1,
    userId: -1,
    userName: "有人",
  };
  return indexData;
}

//批量查询topic的基础信息
export async function getBasicTopicsInfo(
  topicIds: number[],
): Promise<TopicBasicInfo[]> {
  if (!topicIds || topicIds.length === 0) {
    return [];
  }
  const headers = await formAuthorizeHeader();
  let url = "/topic/basic";
  for (let i = 0; i < topicIds.length; i++) {
    if (i === 0) {
      url = `${url}?id=${topicIds[i]}`;
    } else {
      url = `${url}&id=${topicIds[i]}`;
    }
  }
  try {
    let response = await cc98Fetch(url, { headers });
    const data = (await response.json()) as TopicBasicInfo[];
    return data;
  } catch (e) {
    return [];
  }
}

//在topicsId中查询topicId，查到了就返回对应的信息，没有就设置一个默认的
export function getThisTopicInfo(
  topicId: number,
  topicIds: readonly TopicBasicInfo[],
): TopicBasicInfo | TopicBasicLookupFallback {
  for (let i in topicIds) {
    if (topicIds[i].id === topicId) {
      return topicIds[i];
    }
  }
  //查询失败
  let indexData = {
    id: topicId,
    title: "未知主题（该主题已被删除或者无权限获取）",
    boardId: 0,
  };
  return indexData;
}
