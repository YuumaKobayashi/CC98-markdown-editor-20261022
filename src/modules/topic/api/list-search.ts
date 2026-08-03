import type {
  BoardBestSaveTopicsInfo,
  RecommendedTopicInfo,
  SearchedTopicInfo,
  TagTopicsInfo,
  TopicInfo,
} from "../model/dto";
import type { FocusTopic, RecommendedTopic } from "../model/view-model";
import {
  toFocusTopic,
  toRecommendedTopic,
  type FocusTopicSource,
} from "../model/mappers";
import { TopicSortMode } from "../model/enums";
import { formAuthorizeHeader, isLogOn } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";
import { getBoardName } from "@modules/board";
import { getBasicUsersInfo, getThisUserInfo } from "@modules/user";
import { transerRecentTime, transerTimeToYearMonthDay } from "@foundation/lib/time";

import { getTagNamebyId } from "./metadata";

export type BoardTopicListError = "not found" | "server error";

async function getBoardTopicListResponse(
  url: string,
): Promise<Response> {
  const headers = await formAuthorizeHeader();
  return cc98Fetch(url, { headers });
}

function getBoardTopicListError(
  response: Response,
): BoardTopicListError | undefined {
  switch (response.status) {
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
}

export async function getNormalTopics(
  boardId: number,
  page: string,
): Promise<TopicInfo[] | BoardTopicListError> {
  const from = (parseInt(page) - 1) * 20;
  const response = await getBoardTopicListResponse(
    `/board/${boardId}/topic?from=${from}&size=20`,
  );
  const error = getBoardTopicListError(response);
  return error || ((await response.json()) as TopicInfo[]);
}

export async function getBestTopics(
  boardId: number,
  page: string,
): Promise<BoardBestSaveTopicsInfo | BoardTopicListError> {
  const from = (parseInt(page) - 1) * 20;
  const response = await getBoardTopicListResponse(
    `/topic/best/board/${boardId}?from=${from}&size=20`,
  );
  const error = getBoardTopicListError(response);
  return error || ((await response.json()) as BoardBestSaveTopicsInfo);
}

export async function getSaveTopics(
  boardId: number,
  page: string,
): Promise<BoardBestSaveTopicsInfo | BoardTopicListError> {
  const from = (parseInt(page) - 1) * 20;
  const response = await getBoardTopicListResponse(
    `/topic/save/board/${boardId}?from=${from}&size=20`,
  );
  const error = getBoardTopicListError(response);
  return error || ((await response.json()) as BoardBestSaveTopicsInfo);
}

export async function getTagTopics(
  boardId: number,
  page: string,
  tag1: number,
  tag2: number,
): Promise<TagTopicsInfo | BoardTopicListError> {
  const from = (parseInt(page) - 1) * 20;
  let query = "";
  if (tag1 !== -1) {
    query += `tag1=${tag1}&`;
  }
  if (tag2 !== -1) {
    query += `tag2=${tag2}&`;
  }
  const response = await getBoardTopicListResponse(
    `/topic/search/board/${boardId}/tag?${query}from=${from}&size=20`,
  );
  const error = getBoardTopicListError(response);
  return error || ((await response.json()) as TagTopicsInfo);
}

export async function getTopTopics(
  boardId: number,
): Promise<TopicInfo[] | BoardTopicListError> {
  const response = await getBoardTopicListResponse(
    `/topic/toptopics?boardid=${boardId}`,
  );
  const error = getBoardTopicListError(response);
  return error || ((await response.json()) as TopicInfo[]);
}

async function enrichFocusTopics(
  topics: readonly FocusTopicSource[],
  formatTime: (value: string) => string,
): Promise<FocusTopic[]> {
  const userIds: number[] = [];
  const enrichments = [];
  for (const topic of topics) {
    let tag1Name: string | null = null;
    let tag2Name: string | null = null;
    if (topic.tag1) {
      const name = await getTagNamebyId(topic.tag1);
      tag1Name = name || null;
      if (topic.tag2) {
        const secondName = await getTagNamebyId(topic.tag2);
        tag2Name = secondName || null;
      }
    }
    const boardName = await getBoardName(topic.boardId);
    if (!topic.isAnonymous && topic.userId !== null) {
      userIds.push(topic.userId);
    }
    enrichments.push({
      boardName,
      tag1Name,
      tag2Name,
      displayTime: formatTime(topic.time),
      displayLastPostTime: formatTime(topic.lastPostTime),
    });
  }

  const usersInfo = await getBasicUsersInfo(userIds);
  return topics.map((topic, index) => {
    if (topic.isAnonymous) {
      return toFocusTopic(topic, {
        ...enrichments[index],
        portraitUrl: "/static/images/_心灵之约.png",
        userName: "匿名用户",
      });
    }
    const userInfo = getThisUserInfo(topic.userId, usersInfo);
    return toFocusTopic(topic, {
      ...enrichments[index],
      portraitUrl: userInfo.portraitUrl || "",
      userName: topic.userName || "",
    });
  });
}

export async function getRandomRecommendedTopic(
  size: number,
): Promise<RecommendedTopic[] | undefined> {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    const headers = await formAuthorizeHeader();
    /**
     * 通过api获取到主题之后转成json格式
     */
    const response = await cc98Fetch(`/topic/random-recommendation?size=${size}`, {
      headers,
    });
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
      //throwLegacyError('NotFoundTopic');
      case 500:
      //throwLegacyError('ServerError');
    }
    const rawTopics = (await response.json()) as RecommendedTopicInfo[];
    const topics = await enrichFocusTopics(
      rawTopics.map((item) => item.topic),
      transerTimeToYearMonthDay,
    );
    return rawTopics.map((item, index) =>
      toRecommendedTopic(item, topics[index]),
    );
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

/**
 * 获取全站新帖
 * @param curPage
 */
export async function getAllNewTopic(
  from: number,
  mediaOnly: boolean = false,
): Promise<FocusTopic[] | undefined> {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    /**
     * 一次性可以获取20个主题
     */
    var size = 20;
    if (from > 480) {
      size = 500 - from;
    }
    const headers = await formAuthorizeHeader();
    /**
     * 通过api获取到主题之后转成json格式
     */
    var url = '';
    if (mediaOnly === true) {
      url = `/topic/new-media?from=${from}&size=${size}`;
    } else {
      url = `/topic/new?from=${from}&size=${size}`;
      //url = `/board/245/topic?from=${from}&size=${size}`; // for dev
    }
    const response = await cc98Fetch(url, {
      headers,
    });
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
      //throwLegacyError('NotFoundTopic');
      case 500:
      //throwLegacyError('ServerError');
    }
    const rawTopics = (await response.json()) as TopicInfo[];
    //console.log("获取到的数据", rawTopics);
    return await enrichFocusTopics(rawTopics, (value) =>
      transerRecentTime(value, false),
    );
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

/**
 * 获取关注帖子,borderId == -2 为收藏的帖子，boardId == -1为关注用户帖子, boardId === 0 为全部关注版面帖子, boardId > 0则为对应版面帖子
 * @param curPage
 */
export async function getFocusTopic(
  boardId: number,
  boardName: string,
  from: number
): Promise<FocusTopic[] | undefined> {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    /**
     * 一次性可以获取20个主题
     */
    var size = 20;
    if (from > 180) {
      size = 200 - from;
    }
    const headers = await formAuthorizeHeader();
    /**
     * 通过api获取到主题之后转成json格式
     */
    let response;
    if (boardId === -1) {
      response = await cc98Fetch(
        `/me/followee/topic?from=${from}&size=${size}&order=${TopicSortMode.CreateTime}`,
        { headers }
      );
    } else if (boardId === 0) {
      response = await cc98Fetch(
        `/me/custom-board/topic?from=${from}&size=${size}`,
        { headers }
      );
    } else if (boardId === -2) {
      response = await cc98Fetch(
        `/topic/me/favorite?from=${from}&size=${size}&order=1`,
        { headers }
      );
    } else {
      response = await cc98Fetch(
        `/board/${boardId}/topic?from=${from}&size=${size}`,
        { headers }
      );
    }
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
      //throwLegacyError('NotFoundTopic');
      case 500:
      //throwLegacyError('ServerError');
    }
    const rawTopics = (await response.json()) as TopicInfo[];
    return await enrichFocusTopics(rawTopics, transerRecentTime);
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getSearchTopic(
  boardId: number,
  words: string[],
  from: number
): Promise<FocusTopic[] | 0 | -1 | null | undefined> {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  if (words) {
    const headers = await formAuthorizeHeader();
    let keyword = words[0];
    for (let i in words) {
      if (i != "0") {
        keyword = `${keyword} ${words[i]}`;
      }
    }
    let size = 20;
    let newTopic: SearchedTopicInfo[];
    if (boardId === 0) {
      try {
        const response = await cc98Fetch(
          `/topic/search?keyword=${encodeURIComponent(
            keyword
          )}&size=${size}&from=${from}`,
          {
            headers: headers,
          }
        );
        switch (response.status) {
          case 401:
            throwLegacyError("UnauthorizedTopic");
          case 403:
            throwLegacyError("TooFrequentSearch");
          case 404:
          //throwLegacyError('NotFoundTopic');
          case 500:
          //throwLegacyError('ServerError');
        }
        const rawTopics = (await response.json()) as SearchedTopicInfo[];
        newTopic = rawTopics;
      } catch (e) {
        return -1;
      }
    } else {
      try {
        const response = await cc98Fetch(
          `/topic/search/board/${boardId}?keyword=${encodeURIComponent(
            keyword
          )}&size=${size}&from=${from}`,
          {
            headers: headers,
          }
        );
        if (response.status === 401) {
          throwLegacyError("LogOut");
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
        const rawTopics = (await response.json()) as SearchedTopicInfo[];
        newTopic = rawTopics;
      } catch (e) {
        return -1;
      }
    }
    //如果有搜索结果就处理一下
    if (newTopic && newTopic.length != 0) {
      return await enrichFocusTopics(newTopic, transerRecentTime);
    }
    //如果没有搜索结果就返回0
    else {
      return 0;
    }
  }
}

/**
 * 获取本周/月热门话题
 * @returns {data} 处理好的热门话题数据
 * @author adddna //基于明一gg的获取新帖
 */
export async function getMonthlyHotTopic(
  type: string,
): Promise<FocusTopic[] | undefined> {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(`/topic/hot-${type}`);

  switch (response.status) {
    case 401:
      throwLegacyError("UnauthorizedTopic");
    case 403:
      throwLegacyError("OperationForbidden");
    case 404:
    //throwLegacyError('NotFoundTopic');
    case 500:
    //throwLegacyError('ServerError');
  }

  const rawTopics = (await response.json()) as TopicInfo[];
  return await enrichFocusTopics(rawTopics, transerRecentTime);
}

/**
 * 获取随机(最近)帖
 */
export async function getRandomTopic(
  size: number,
): Promise<FocusTopic[] | undefined> {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    /**
     * 一次性固定获取个主题
     */
    const headers = await formAuthorizeHeader();
    /**
     * 通过api获取到主题之后转成json格式
     */
    const response = await cc98Fetch(`/topic/random-recent?size=${size}`, {
      headers,
    });
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
      //throwLegacyError('NotFoundTopic');
      case 500:
      //throwLegacyError('ServerError');
    }
    const rawTopics = (await response.json()) as TopicInfo[];
    const newTopic = await enrichFocusTopics(rawTopics, (value) =>
      transerRecentTime(value, false),
    );
    console.log("获取到的数据", newTopic);
    return newTopic;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}
