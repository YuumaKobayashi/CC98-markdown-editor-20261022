import {
  cc98Fetch,
} from "@foundation/api/http";
import { formAuthorizeHeader } from "@modules/session";
import type { BoardInfo, BoardTagInfo } from "@modules/board";
import type {
  BoardBestSaveTopicsInfo,
  TagTopicsInfo,
  TopicInfo,
} from "@modules/topic";
import type { PostInfo } from "@modules/post";
import type { BoardEventInfo } from "../model/types";

export const getBoardInfo = async (boardId: string) => {
  const headers = await formAuthorizeHeader();
  const url = `/board/${boardId}`;
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  const data = (await response.json()) as BoardInfo;
  if (data.canEntry === false) {
    return "unauthorized";
  }
  return data;
};

export const getNormalTopics = async (boardId: number, page: string) => {
  const from = (parseInt(page) - 1) * 20;
  const url = `/board/${boardId}/topic?from=${from}&size=20`;
  return (await getTopics(url)) as TopicInfo[];
};

export const getBestTopics = async (boardId: number, page: string) => {
  const from = (parseInt(page) - 1) * 20;
  const url = `/topic/best/board/${boardId}?from=${from}&size=20`;
  return (await getTopics(url)) as BoardBestSaveTopicsInfo;
};

export const getSaveTopics = async (boardId: number, page: string) => {
  const from = (parseInt(page) - 1) * 20;
  const url = `/topic/save/board/${boardId}?from=${from}&size=20`;
  return (await getTopics(url)) as BoardBestSaveTopicsInfo;
};

export const getTagTopics = async (
  boardId: number,
  page: string,
  tag1: number,
  tag2: number,
) => {
  const from = (parseInt(page) - 1) * 20;
  let query = "";
  if (tag1 !== -1) {
    query += `tag1=${tag1}&`;
  }
  if (tag2 !== -1) {
    query += `tag2=${tag2}&`;
  }
  const url = `/topic/search/board/${boardId}/tag?${query}from=${from}&size=20`;
  return (await getTopics(url)) as TagTopicsInfo;
};

export const getTopTopics = async (boardId: number) => {
  const headers = await formAuthorizeHeader();
  const url = `/topic/toptopics?boardid=${boardId}`;
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return (await response.json()) as TopicInfo[];
};

export const getShortTopic = async (topicId: number) => {
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
};

//TODO：把这个抽象函数拆咯 三个地方都有调用
export const getTopics = async (url: string) => {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  return (await response.json()) as unknown;
};

export const getTags = async (boardId: number) => {
  const headers = await formAuthorizeHeader();
  const url = `/board/${boardId}/tag`;
  const response = await cc98Fetch(url, { headers });
  return (await response.json()) as BoardTagInfo[];
};

export const multiDelete = async (topicIds: number[], reason: string) => {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  let query = "id=";
  query += topicIds.join("&id=");
  const url = `/topic/multi-delete?${query}`;
  const body = JSON.stringify({ reason });
  return await cc98Fetch(url, { method: "PUT", headers, body });
};

export const multiLock = async (
  topicIds: number[],
  reason: string,
  value: number,
) => {
  const headers = await formAuthorizeHeader();
  let query = "id=";
  query += topicIds.join("&id=");
  const url = `/topic/multi-lock?${query}`;
  const body = JSON.stringify({ reason, value });
  headers.append("Content-Type", "application/json");
  return await cc98Fetch(url, { method: "PUT", headers, body });
};

export const getBoardRecords = async (boardId: string, from: number) => {
  const url = `/board/${boardId}/events?from=${from}&size=7`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return (await response.json()) as BoardEventInfo;
};

export const editBigPaper = async (boardId: string, content: string) => {
  const url = `/board/${boardId}/big-paper`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify({ content });
  return await cc98Fetch(url, { method: "PUT", headers, body });
};
