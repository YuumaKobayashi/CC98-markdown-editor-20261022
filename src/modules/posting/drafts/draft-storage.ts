import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

const EDITOR_CONTENT_CACHE_KEY = "contentCache";
const LEGACY_TEMPORARY_CONTENT_KEY = "temporaryContent";

function getReplyDraftKey(topicId: number): string {
  return `temporaryContent-${topicId}`;
}

function getFailedReplyCacheKey(topicId: number): string {
  return `post-cache-${topicId}`;
}

export function getEditorContentCache<T>(): T | undefined {
  return getLocalStorage<T>(EDITOR_CONTENT_CACHE_KEY);
}

export function setEditorContentCache(value: unknown): void {
  setLocalStorage(EDITOR_CONTENT_CACHE_KEY, value);
}

export function clearEditorContentCache(): void {
  removeLocalStorage(EDITOR_CONTENT_CACHE_KEY);
}

export function getReplyDraft(topicId: number): string | undefined {
  return getLocalStorage<string>(getReplyDraftKey(topicId));
}

export function setReplyDraft(topicId: number, value: string): void {
  setLocalStorage(getReplyDraftKey(topicId), value);
}

export function clearReplyDraft(topicId: number): void {
  removeLocalStorage(getReplyDraftKey(topicId));
}

export function clearLegacyTemporaryContent(): void {
  removeLocalStorage(LEGACY_TEMPORARY_CONTENT_KEY);
}

export function getFailedReplyCache(topicId: number): string | undefined {
  return getLocalStorage<string>(getFailedReplyCacheKey(topicId));
}

export function setFailedReplyCache(topicId: number, value: string): void {
  setLocalStorage(getFailedReplyCacheKey(topicId), value);
}

export function clearFailedReplyCache(topicId: number): void {
  removeLocalStorage(getFailedReplyCacheKey(topicId));
}
