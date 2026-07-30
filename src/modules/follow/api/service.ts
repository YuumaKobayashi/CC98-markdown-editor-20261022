import { getMyInfo } from "@modules/session";
import { removeStorage } from "@foundation/storage/web-storage";
import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { refreshUserInfo } from "@modules/session";

/**
 * 关注指定id的用户
 * @param userId
 */
export async function followUser(userId: number) {
  try {
    const headers = await formAuthorizeHeader();
    const url = `/me/followee/${userId}`;

    let res = await cc98Fetch(url, {
      method: "PUT",
      headers,
    });
    if (res.status === 200) {
      return true;
    } else {
      throw new Error(await res.text());
    }
  } catch (e) {
    return e.message;
  }
}

/**
 * 取关指定id的用户
 * @param userId
 */
export async function unfollowUser(userId: number) {
  try {
    const headers = await formAuthorizeHeader();
    const url = `/me/followee/${userId}`;

    let res = await cc98Fetch(url, {
      method: "DELETE",
      headers,
    });
    if (res.status === 200) {
      return true;
    } else {
      throw new Error(res.statusText);
    }
  } catch (e) {
    return false;
  }
}

export function isFollowThisBoard(boardId) {
  if (!getMyInfo()) return false;
  const customBoards = getMyInfo().customBoards;
  if (customBoards) {
    for (let item of customBoards) {
      if (item == boardId) {
        return true;
      }
    }
  }
  return false;
}

export async function followBoard(boardId) {
  const headers = await formAuthorizeHeader();
  const url = `/me/custom-board/${boardId}`;
  const response = await cc98Fetch(url, { method: "PUT", headers });
  await refreshUserInfo();
  removeStorage("focusBoardList");
}

export async function unfollowBoard(boardId) {
  const headers = await formAuthorizeHeader();
  const url = `/me/custom-board/${boardId}`;
  const response = await cc98Fetch(url, { method: "DELETE", headers });
  await refreshUserInfo();
  removeStorage("focusBoardList");
}
