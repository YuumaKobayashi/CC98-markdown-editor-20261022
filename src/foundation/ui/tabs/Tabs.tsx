import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./Tabs.module.scss";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  ariaLabel?: string;
}

export function Tabs({ items, activeId, defaultActiveId, onActiveChange, ariaLabel = "标签页", className, ...props }: TabsProps) {
  const firstEnabledId = items.find((item) => !item.disabled)?.id ?? "";
  const [internalActiveId, setInternalActiveId] = React.useState(defaultActiveId ?? firstEnabledId);
  const requestedActiveId = activeId ?? internalActiveId;
  const selectedId = items.some((item) => item.id === requestedActiveId && !item.disabled) ? requestedActiveId : firstEnabledId;
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const instanceId = React.useId().replace(/:/g, "");

  const select = (id: string) => {
    if (activeId === undefined) setInternalActiveId(id);
    onActiveChange?.(id);
  };

  const moveFocus = (startIndex: number, direction: 1 | -1) => {
    for (let offset = 1; offset <= items.length; offset += 1) {
      const index = (startIndex + direction * offset + items.length) % items.length;
      if (!items[index].disabled) { tabRefs.current[index]?.focus(); select(items[index].id); return; }
    }
  };

  return (
    <div {...props} className={mergeClassNames(styles.tabs, className)}>
      <div className={styles.tabList} role="tablist" aria-label={ariaLabel}>
        {items.map((item, index) => {
          const selected = item.id === selectedId;
          return (
            <button key={item.id} ref={(node) => { tabRefs.current[index] = node; }} id={`${instanceId}-tab-${item.id}`} type="button" role="tab" className={styles.tab} aria-selected={selected} aria-controls={`${instanceId}-tabpanel-${item.id}`} tabIndex={selected ? 0 : -1} disabled={item.disabled} onClick={() => select(item.id)} onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); moveFocus(index, event.key === "ArrowRight" ? 1 : -1); }
              else if (event.key === "Home" || event.key === "End") { event.preventDefault(); const enabled = items.map((entry, itemIndex) => ({ entry, itemIndex })).filter(({ entry }) => !entry.disabled); const target = event.key === "Home" ? enabled[0] : enabled[enabled.length - 1]; if (target) { tabRefs.current[target.itemIndex]?.focus(); select(target.entry.id); } }
            }}>
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div key={item.id} id={`${instanceId}-tabpanel-${item.id}`} role="tabpanel" aria-labelledby={`${instanceId}-tab-${item.id}`} tabIndex={0} className={styles.panel} hidden={item.id !== selectedId}>
          {item.content}
        </div>
      ))}
    </div>
  );
}
