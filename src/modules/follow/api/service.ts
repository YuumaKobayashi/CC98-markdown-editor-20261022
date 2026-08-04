import { getMyInfo, getToken } from "@modules/session/api/session";
import { removeStorage } from "@foundation/storage/web-storage";
import { formAuthorizeHeader } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import { refreshUserInfo } from "@modules/session/api/refresh-user-info";
import { getUsersInfo } from "@modules/user/api/get-users-info";
import type { UserInfo } from "@modules/user/model/dto";
import { getAccessToken } from "@foundation/storage/web-storage";

export async function updateFollowedUser(
  userId: number,
  method: "PUT" | "DELETE",
): Promise<Response> {
  const headers = new Headers();
  headers.append("Authorization", getAccessToken());
  return cc98Fetch(`/me/followee/${userId}`, {
    method,
    headers,
  });
}

export async function updateFollowedBoard(
  boardId: number,
  method: "DELETE" | "PUT",
): Promise<Response> {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  return cc98Fetch(`/me/custom-board/${boardId}`, { method, headers });
}

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

  const userIds = (await response.json()) as number[];
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

  const userIds = (await response.json()) as number[];
  if (userIds.length === 0) {
    return [];
  }

  return await getUsersInfo(userIds);
}

/**
 * 关注指定id的用户
 * @param userId
 */
export async function followUser(
  userId: number,
): Promise<true | string | undefined> {
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
export async function unfollowUser(userId: number): Promise<boolean> {
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

export function isFollowThisBoard(boardId: number): boolean {
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

export async function followBoard(boardId: number): Promise<void> {
  const headers = await formAuthorizeHeader();
  const url = `/me/custom-board/${boardId}`;
  const response = await cc98Fetch(url, { method: "PUT", headers });
  await refreshUserInfo();
  removeStorage("focusBoardList");
}

export async function unfollowBoard(boardId: number): Promise<void> {
  const headers = await formAuthorizeHeader();
  const url = `/me/custom-board/${boardId}`;
  const response = await cc98Fetch(url, { method: "DELETE", headers });
  await refreshUserInfo();
  removeStorage("focusBoardList");
}
