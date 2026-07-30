import * as React from "react";

import { useAppDispatch } from "@application/store";
import { synchronizeSessionStorageEvent } from "@modules/session";

type CrossTabStorageHandler = (
  event: StorageEvent,
  dispatch: ReturnType<typeof useAppDispatch>
) => void;

/**
 * S1.1 只接管当前用户；showCardUser 仍由 Header 保持到 S1.2。
 */
export const crossTabSyncHandlers: Readonly<
  Record<string, CrossTabStorageHandler>
> = Object.freeze({
  userInfo(event, dispatch) {
    dispatch(synchronizeSessionStorageEvent(event));
  },
});

export const CROSS_TAB_SYNC_KEYS: readonly string[] = Object.freeze(
  Object.keys(crossTabSyncHandlers)
);

interface CrossTabSyncProps {
  children: React.ReactElement<any>;
}

/** Register the application-level storage bridge once and clean it up. */
export function CrossTabSync({
  children,
}: CrossTabSyncProps): React.ReactElement<any> {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    function handleStorage(event: StorageEvent): void {
      if (event.key === null) {
        return;
      }

      const handler = crossTabSyncHandlers[event.key];
      if (handler) {
        handler(event, dispatch);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch]);

  return children;
}
