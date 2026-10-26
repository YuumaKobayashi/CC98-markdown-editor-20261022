import { shouldUseIndexedDb } from "@foundation/config/platform";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

import {
  addUserInfo,
  getUserInfo,
  getUsersInfo,
  removeUserInfo,
} from "./user-cache";

const USER_CACHE_TTL_SECONDS = 3600;
type CachedUserInfo = Awaited<ReturnType<typeof getUserInfo>>;

function getUserCacheKey(key: number | string): string {
  return typeof key === "number" ? `userId_${key}` : `userName_${key}`;
}

export async function readUserInfoCache(
  key: number | string
): Promise<CachedUserInfo | undefined> {
  if (shouldUseIndexedDb) {
    return await getUserInfo(key);
  }

  return getLocalStorage<CachedUserInfo>(getUserCacheKey(key));
}

export function readLocalUserInfoCache(
  key: number | string
): CachedUserInfo | undefined {
  return getLocalStorage<CachedUserInfo>(getUserCacheKey(key));
}

export async function readUsersInfoCache(
  keys: (number | string)[]
): Promise<(CachedUserInfo | undefined)[]> {
  if (shouldUseIndexedDb) {
    return await getUsersInfo(keys);
  }

  return keys.map((key) =>
    getLocalStorage<CachedUserInfo>(getUserCacheKey(key))
  );
}

export async function writeUserInfoCache(
  userInfo: CachedUserInfo
): Promise<void> {
  if (shouldUseIndexedDb) {
    await addUserInfo(userInfo);
    return;
  }

  setLocalStorage(
    getUserCacheKey(userInfo.id),
    userInfo,
    USER_CACHE_TTL_SECONDS
  );
  setLocalStorage(
    getUserCacheKey(userInfo.name),
    userInfo,
    USER_CACHE_TTL_SECONDS
  );
}

export async function invalidateUserInfoCache(
  id: number,
  name: string
): Promise<void> {
  removeLocalStorage(getUserCacheKey(id));
  removeLocalStorage(getUserCacheKey(name));

  if (shouldUseIndexedDb) {
    await removeUserInfo(id);
  }
}
