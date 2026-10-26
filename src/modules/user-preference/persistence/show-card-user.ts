import { useSyncExternalStore } from "react";

import {
  getLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

const SHOW_CARD_USER_KEY = "showCardUser";
const showCardUserListeners = new Set<() => void>();

function notifyShowCardUserListeners(): void {
  showCardUserListeners.forEach((listener) => listener());
}

function subscribeShowCardUser(listener: () => void): () => void {
  showCardUserListeners.add(listener);
  return () => {
    showCardUserListeners.delete(listener);
  };
}

export function getShowCardUser(): boolean {
  return getLocalStorage<string>(SHOW_CARD_USER_KEY) !== "false";
}

export function setShowCardUser(visible: boolean): void {
  setLocalStorage(SHOW_CARD_USER_KEY, visible, 0);
  notifyShowCardUserListeners();
}

export function useShowCardUser(): boolean {
  return useSyncExternalStore(
    subscribeShowCardUser,
    getShowCardUser,
    () => true
  );
}

export function synchronizeShowCardUserStorageEvent(
  event: StorageEvent
): void {
  if (
    event.key !== SHOW_CARD_USER_KEY ||
    event.oldValue === event.newValue
  ) {
    return;
  }

  notifyShowCardUserListeners();
}
