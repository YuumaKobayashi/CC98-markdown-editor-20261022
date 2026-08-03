import { boardInfo } from "../model/board-info";
import {
  readBoardInfoCache,
  readBoardsInfoCache,
  writeBoardInfoCache,
  writeBoardsInfoCache,
} from "../cache/board-cache";
import { getMyInfo } from "@modules/session";
import { getToken, formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import type {
  BoardInfo,
  BoardStopPostUserInfo,
  BoardTagInfoV2,
} from "../model/types";
import type { BoardCategoryInfo, BoardSimpleInfo } from "../model/dto";

/*
 * 根据boardId返回boardName
 */
export function syncGetBoardNameById(boardId) {
  for (let item of boardInfo) {
    if (boardId === item.id) {
      return item.name;
    }
  }
  return "未知版面";
}

export async function getBoardName(boardId: number): Promise<string> {
  for (let item of boardInfo) {
    if (boardId === item.id) {
      return item.name;
    }
  }

  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  const url = `/board/${boardId}`;
  try {
    let res = await cc98Fetch(url, { headers });
    const data = (await res.json()) as BoardInfo;
    let boardName = data.name;
    return boardName;
  } catch (e) {
    return "未知版面";
  }
}

/**
 * 搜索指定关键词版面，版面名称或版面描述中包含关键词的结果都会返回
 * @param boardId
 * @param word
 */
export async function getSearchBoard(
  word: string,
): Promise<BoardSimpleInfo[] | undefined> {
  if (word) {
    const url = `/board/search?keyword=${word}`;
    const response = await cc98Fetch(url);
    /*switch (response.status) {
            case 401:
                throwLegacyError('UnauthorizedBoard');
                return null;
            case 403:
                throwLegacyError('OperationForbidden');
                return null;
            case 404:
                throwLegacyError('NotFoundBoard');
                return null;
            case 500:
                throwLegacyError('ServerError');
                return null;
        }*/
    const data = (await response.json()) as BoardSimpleInfo[];
    return data;
  }
}

export async function getBoards(): Promise<BoardCategoryInfo[]> {
  const boards = readBoardsInfoCache<BoardCategoryInfo[]>();
  if (!boards) {
    const url = "/board/all";
    const response = await cc98Fetch(url);
    const data = (await response.json()) as BoardCategoryInfo[];
    writeBoardsInfoCache(data);
    return data;
  } else {
    return boards;
  }
}

/**
 * 获取版面列表页使用的全部版面分类。
 * 保持旧页面每次进入时直接请求 `/Board/all`，不复用 module 版面缓存。
 */
export async function getBoardList(): Promise<BoardCategoryInfo[]> {
  const response = await cc98Fetch("/Board/all");
  return (await response.json()) as BoardCategoryInfo[];
}

/**
 * 获取当前用户收藏的版面信息。
 * @author AsukaSong
 */
export async function getCurrentUserFavoriteBoards(
  boardIds: readonly number[],
): Promise<BoardInfo[]> {
  if (boardIds.length === 0) {
    return [];
  }

  const query = boardIds.join("&id=");
  const url = `/board/?id=${query}`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return (await response.json()) as BoardInfo[];
}

export async function getBoardId(boardName: string) {
  let boardInfo =
    readBoardInfoCache<any[]>() ||
    (await fetch("/static/boardinfo.json").then((res) => res.json()));
  writeBoardInfoCache(boardInfo);
  let boardResult = [];
  //看是否包含
  for (let i in boardInfo) {
    if (boardInfo[i].name.indexOf(boardName) > -1) {
      boardResult.push({ id: boardInfo[i].id, name: boardInfo[i].name });
    }
  }
  return boardResult;
}

export async function getBoardInfo(
  boardId: number,
): Promise<BoardInfo | "not found" | "server error" | "unauthorized"> {
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
}

export function isMaster(masters: readonly string[] | null | undefined): boolean {
  const userInfo = getMyInfo();

  if (userInfo) {
    const privilege = userInfo.privilege;
    const myName = userInfo.name;
    const myId = userInfo.id;
    if (privilege === "管理员" || privilege === "超级版主") {
      return true;
    }
    if (masters) {
      for (let i = 0; i < masters.length; i++) {
        if (myName === masters[i]) {
          return true;
        }
      }
    } else {
      return false;
    }
  }
  return false;
}

export async function getBoardTagV2(
  boardId: number | string,
): Promise<BoardTagInfoV2> {
  const headers = await formAuthorizeHeader();
  const url = `/board/${boardId}/tag-v2`;
  const response = await cc98Fetch(url, { headers });
  const data = (await response.json()) as BoardTagInfoV2;
  return data;
}

export async function getTpUsers(
  boardId: number,
  from: number,
  size: number,
): Promise<BoardStopPostUserInfo[]> {
  const url = `/board/${boardId}/stop-post-user?from=${from}&size=${size}`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, { headers });
  return (await response.json()) as BoardStopPostUserInfo[];
}
