import {
  getLocalStorage,
  getStorage,
  setLocalStorage,
  setStorage,
} from "@foundation/storage/web-storage";

const BOARDS_INFO_CACHE_KEY = "boardsInfo";
const BOARD_INFO_CACHE_KEY = "boardInfo";
const BOARDS_INFO_CACHE_TTL_SECONDS = 3600;

export function readBoardsInfoCache<T = any>(): T | undefined {
  return getLocalStorage<T>(BOARDS_INFO_CACHE_KEY);
}

export function readLegacyRawBoardsInfoCache<T = any>(): T {
  return JSON.parse(localStorage.getItem(BOARDS_INFO_CACHE_KEY)) as T;
}

export function writeBoardsInfoCache(value: unknown): void {
  setLocalStorage(
    BOARDS_INFO_CACHE_KEY,
    value,
    BOARDS_INFO_CACHE_TTL_SECONDS
  );
}

export function clearInvalidBoardsInfoCache(): void {
  const previousBoards = localStorage.getItem(BOARDS_INFO_CACHE_KEY);
  if (previousBoards && previousBoards.indexOf("obj-") !== 0) {
    localStorage.removeItem(BOARDS_INFO_CACHE_KEY);
  }
}

export function readBoardInfoCache<T>(): T | undefined {
  return getStorage(BOARD_INFO_CACHE_KEY) as T | undefined;
}

export function writeBoardInfoCache(value: unknown): void {
  setStorage(BOARD_INFO_CACHE_KEY, value);
}
