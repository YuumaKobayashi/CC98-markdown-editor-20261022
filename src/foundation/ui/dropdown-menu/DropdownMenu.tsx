import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./DropdownMenu.module.scss";

export interface DropdownMenuItem {
  key: React.Key;
  label: React.ReactNode;
  onSelect: () => void | Promise<void>;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  children: React.ReactNode;
  items: ReadonlyArray<DropdownMenuItem>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openOnHover?: boolean;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  ariaLabel?: string;
  triggerClassName?: string;
}

export function DropdownMenu({
  children,
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  openOnHover = true,
  openDelay = 100,
  closeDelay = 100,
  disabled = false,
  ariaLabel,
  triggerClassName,
}: DropdownMenuProps) {
  return (
    <BaseMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
      disabled={disabled}
      modal={false}
    >
      <BaseMenu.Trigger
        type="button"
        className={mergeClassNames(styles.trigger, triggerClassName)}
        openOnHover={openOnHover}
        delay={openDelay}
        closeDelay={closeDelay}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {children}
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          className={styles.positioner}
          side="bottom"
          align="start"
          sideOffset={4}
          collisionAvoidance={{
            side: "flip",
            align: "shift",
            fallbackAxisSide: "none",
          }}
        >
          <BaseMenu.Popup className={styles.popup}>
            {items.map((item) => (
              <BaseMenu.Item
                key={item.key}
                className={styles.item}
                disabled={item.disabled}
                onClick={() => {
                  void item.onSelect();
                }}
              >
                {item.label}
              </BaseMenu.Item>
            ))}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
