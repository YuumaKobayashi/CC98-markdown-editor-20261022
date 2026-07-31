import { getMyInfo } from "@modules/session";
import { removeStorage } from "@foundation/storage/web-storage";
import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { refreshUserInfo } from "@modules/session";
import { getUsersInfo } from "@modules/user";
import type { UserInfo } from "@legacy/States/AppState";

/**
 * 获取当前用户的粉丝信息。
 * @param page 当前页数
 * @author AsukaSong
 */
export async function getCurrentUserFans(
  page: number,
): Promise<UserInfo[]> {
  const headers = await formAuthorizeHeader();
  const url = `/me/follower?from=${(page - 1) * 10}&size=10`;
  const response = await cc98Fetch(url, { headers });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const userIds: number[] = await response.json();
  if (userIds.length === 0) {
    return [];
  }

  return await getUsersInfo(userIds);
}

/**
 * 获取当前用户关注的用户信息。
 * @param page 当前页数
 * @author AsukaSong
 */
export async function getCurrentUserFollowings(
  page: number,
): Promise<UserInfo[]> {
  const headers = await formAuthorizeHeader();
  const url = `/me/followee?from=${(page - 1) * 10}&size=10`;
  const response = await cc98Fetch(url, { headers });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const userIds: number[] = await response.json();
  if (userIds.length === 0) {
    return [];
  }

  return await getUsersInfo(userIds);
}

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
