import {
  getLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

const TAG_INFO_CACHE_KEY = "tagInfo";
const TAG_INFO_CACHE_TTL_SECONDS = 600;

export function readTagInfoCache<T>(): T | undefined {
  return getLocalStorage<T>(TAG_INFO_CACHE_KEY);
}

export function writeTagInfoCache(value: unknown): void {
  setLocalStorage(TAG_INFO_CACHE_KEY, value, TAG_INFO_CACHE_TTL_SECONDS);
}

export function readRawTagInfoCache<T>(): T {
  return JSON.parse(localStorage.getItem(TAG_INFO_CACHE_KEY).slice(4)) as T;
}
