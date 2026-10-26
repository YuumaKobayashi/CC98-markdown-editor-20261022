import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

function getSigninCacheKey(userId: number): string {
  return `signin_${userId}`;
}

function getSigninCacheLifetime(): number {
  return (
    new Date(new Date().setHours(0, 0, 0, 0)).getTime() +
    86400000 -
    new Date().getTime()
  ) / 1000;
}

export function hasSignedInToday(userId: number): boolean {
  return Boolean(getLocalStorage(getSigninCacheKey(userId)));
}

export function markSignedInToday(userId: number): void {
  setLocalStorage(
    getSigninCacheKey(userId),
    true,
    getSigninCacheLifetime()
  );
}

export function clearSignedInToday(userId: number): void {
  removeLocalStorage(getSigninCacheKey(userId));
}
