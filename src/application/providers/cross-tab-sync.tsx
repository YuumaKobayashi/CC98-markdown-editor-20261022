import * as React from "react";

import { useAppDispatch } from "@application/store";
import { synchronizeSessionStorageEvent } from "@modules/session";
import { synchronizeShowCardUserStorageEvent } from "@modules/user-preference";

type CrossTabStorageHandler = (
  event: StorageEvent,
  dispatch: ReturnType<typeof useAppDispatch>
) => void;

/** Application-level cross-tab synchronization handlers. */
export const crossTabSyncHandlers: Readonly<
  Record<string, CrossTabStorageHandler>
> = Object.freeze({
  userInfo(event, dispatch) {
    dispatch(synchronizeSessionStorageEvent(event));
  },
  showCardUser(event) {
    synchronizeShowCardUserStorageEvent(event);
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
