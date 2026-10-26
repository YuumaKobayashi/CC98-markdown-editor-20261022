import * as React from "react";
import { mergeClassNames } from "@foundation/lib/class-names";
import { RightOutlined } from "@foundation/ui/icon";

import styles from "./Accordion.module.scss";

export interface AccordionItem {
  id: string;
  heading: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  interactiveHeading?: boolean;
  toggleLabel?: string;
  className?: string;
  contentClassName?: string;
  panelClassName?: string;
  style?: React.CSSProperties;
}

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: AccordionItem[];
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
  allowMultiple?: boolean;
  bordered?: boolean;
  showIndicator?: boolean;
}

export function Accordion({
  items,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  allowMultiple = true,
  bordered = true,
  showIndicator = true,
  className,
  ...props
}: AccordionProps) {
  const [internalExpandedIds, setInternalExpandedIds] = React.useState(defaultExpandedIds);
  const activeIds = expandedIds ?? internalExpandedIds;
  const triggerRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const instanceId = React.useId().replace(/:/g, "");

  const setExpanded = (nextIds: string[]) => {
    if (expandedIds === undefined) setInternalExpandedIds(nextIds);
    onExpandedChange?.(nextIds);
  };

  const toggle = (item: AccordionItem) => {
    if (item.disabled) return;
    const isExpanded = activeIds.includes(item.id);
    setExpanded(isExpanded ? activeIds.filter((id) => id !== item.id) : allowMultiple ? [...activeIds, item.id] : [item.id]);
  };

  const focusTrigger = (startIndex: number, direction: 1 | -1) => {
    for (let offset = 1; offset <= items.length; offset += 1) {
      const index = (startIndex + offset * direction + items.length) % items.length;
      if (!items[index].disabled) { triggerRefs.current[index]?.focus(); return; }
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusTrigger(index, event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const candidates = items.map((entry, itemIndex) => ({ entry, itemIndex })).filter(({ entry }) => !entry.disabled);
      triggerRefs.current[(event.key === "Home" ? candidates[0] : candidates[candidates.length - 1])?.itemIndex]?.focus();
    }
  };

  return (
    <div {...props} className={mergeClassNames(styles.accordion, bordered ? styles.bordered : styles.borderless, className)}>
      {items.map((item, index) => {
        const isExpanded = activeIds.includes(item.id);
        const triggerId = `${instanceId}-accordion-trigger-${item.id}`;
        const panelId = `${instanceId}-accordion-panel-${item.id}`;
        return (
          <section key={item.id} className={mergeClassNames(styles.item, item.className)} style={item.style}>
            <h3 className={mergeClassNames(styles.heading, item.interactiveHeading && styles.interactiveHeading)}>
              {item.interactiveHeading && <div className={styles.richLabel}>{item.heading}</div>}
              <button ref={(node) => { triggerRefs.current[index] = node; }} id={triggerId} type="button" className={mergeClassNames(styles.trigger, item.interactiveHeading && styles.richTrigger)} aria-expanded={isExpanded} aria-controls={panelId} aria-label={item.interactiveHeading ? item.toggleLabel ?? "展开或收起" : undefined} disabled={item.disabled} onClick={() => toggle(item)} onKeyDown={(event) => handleTriggerKeyDown(event, index)}>
                {showIndicator && <span className={styles.indicator} aria-hidden="true"><RightOutlined /></span>}
                {!item.interactiveHeading && <span className={styles.label}>{item.heading}</span>}
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={triggerId} className={mergeClassNames(styles.panel, item.panelClassName)} hidden={!isExpanded}>
              <div className={mergeClassNames(styles.content, item.contentClassName)}>{item.content}</div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
