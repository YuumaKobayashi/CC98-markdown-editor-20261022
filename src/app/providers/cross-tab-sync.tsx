import * as React from "react";

type CrossTabStorageHandler = (event: StorageEvent) => void;

/**
 * P09 deliberately starts with no synchronized keys. Existing userInfo and
 * showCardUser listeners remain in Header until P17 owns their migration.
 */
export const crossTabSyncHandlers: Readonly<
  Record<string, CrossTabStorageHandler>
> = Object.freeze({});

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
  React.useEffect(() => {
    function handleStorage(event: StorageEvent): void {
      if (event.key === null) {
        return;
      }

      const handler = crossTabSyncHandlers[event.key];
      if (handler) {
        handler(event);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return children;
}
