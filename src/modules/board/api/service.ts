import { boardInfo } from "../model/board-info";
import { getMyInfo } from "@modules/user";
import { setStorage, getStorage, setLocalStorage, getLocalStorage } from "@foundation/storage/web-storage";
import { getToken, formAuthorizeHeader } from "@features/auth/api/session";
import { cc98Fetch } from "@foundation/api/http";

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

export async function getBoardName(boardId: number) {
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
    let data = await res.json();
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
export async function getSearchBoard(word: string) {
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
    const data = await response.json();
    return data;
  }
}

export async function getBoards() {
  const boards = getLocalStorage("boardsInfo");
  if (!boards) {
    const url = "/board/all";
    const response = await cc98Fetch(url);
    const data = await response.json();
    setLocalStorage("boardsInfo", data, 3600);
    return data;
  } else {
    return boards;
  }
}

export async function getBoardId(boardName: string) {
  let boardInfo =
    getStorage("boardInfo") ||
    (await fetch("/static/boardinfo.json").then((res) => res.json()));
  setStorage("boardInfo", boardInfo);
  let boardResult = [];
  //看是否包含
  for (let i in boardInfo) {
    if (boardInfo[i].name.indexOf(boardName) > -1) {
      boardResult.push({ id: boardInfo[i].id, name: boardInfo[i].name });
    }
  }
  return boardResult;
}

export async function getBoardInfo(boardId) {
  const headers = await formAuthorizeHeader();
  const url = `/board/${boardId}`;
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 404:
      return "not found";
    case 500:
      return "server error";
  }
  const data = await response.json();
  if (data.canEntry === false) {
    return "unauthorized";
  }
  return data;
}

export function isMaster(masters) {
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

export async function getBoardTag(boardId) {
  const headers = await formAuthorizeHeader();
  const url = `/board/${boardId}/tag`;
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}

export async function getBoardTagV2(boardId) {
  const headers = await formAuthorizeHeader();
  const url = `/board/${boardId}/tag-v2`;
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}

/**
 * @mingyigg
 * @param boardId
 * @param from
 * @param size
 */
export async function getBoardRecord(
  boardId: number,
  from: number,
  size: number
) {
  const headers = await formAuthorizeHeader();
  const url = `/board/${boardId}/events?from=${from}&size=${size}`;
  const response = await cc98Fetch(url, { headers });
  const json = await response.json();
  console.log("版面事件记录", json);
  return json;
}

export async function getTpUsers(boardId, from, size) {
  const url = `/board/${boardId}/stop-post-user?from=${from}&size=${size}`;
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, { headers });
  return await response.json();
}
