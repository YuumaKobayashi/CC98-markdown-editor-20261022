import * as React from "react";
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./Popover.module.scss";

type PopoverSide = "top" | "right" | "bottom" | "left";
type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  children: React.ReactElement;
  title?: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  side?: PopoverSide;
  align?: PopoverAlign;
  collisionPadding?: number;
  disabled?: boolean;
  openOnFocus?: boolean;
  freezeInitialPosition?: boolean;
  className?: string;
}

export function Popover({
  children,
  title,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 1500,
  closeDelay = 100,
  side = "top",
  align = "center",
  collisionPadding = 5,
  disabled = false,
  openOnFocus = false,
  freezeInitialPosition = false,
  className,
}: PopoverProps) {
  const triggerId = React.useId();
  const pointerFocusPendingRef = React.useRef(false);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const actualOpen = open ?? uncontrolledOpen;
  const [hasOpened, setHasOpened] = React.useState(
    () => !disabled && actualOpen,
  );

  const requestOpenChange = (nextOpen: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(nextOpen);
      if (nextOpen) setHasOpened(true);
    }
    onOpenChange?.(nextOpen);
  };

  React.useEffect(() => {
    if (!disabled && actualOpen) setHasOpened(true);
  }, [actualOpen, disabled]);

  if (disabled) return children;

  return (
    <BasePreviewCard.Root
      open={actualOpen}
      triggerId={triggerId}
      onOpenChange={requestOpenChange}
    >
      <BasePreviewCard.Trigger
        render={children}
        id={triggerId}
        delay={openDelay}
        closeDelay={closeDelay}
        onPointerDown={() => {
          // Chromium may report pointer-focused links as :focus-visible.
          pointerFocusPendingRef.current = true;
          queueMicrotask(() => {
            pointerFocusPendingRef.current = false;
          });
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !actualOpen) return;
          const target = event.target;
          if (
            target instanceof Element &&
            target.closest("[data-base-ui-tooltip-trigger]")
          ) {
            return;
          }
          event.preventBaseUIHandler();
          requestOpenChange(false);
        }}
        onFocus={
          openOnFocus
            ? (event) => {
                if (pointerFocusPendingRef.current) {
                  pointerFocusPendingRef.current = false;
                  event.preventBaseUIHandler();
                  return;
                }
                const target = event.target;
                if (
                  target instanceof Element &&
                  target.matches(":focus-visible")
                ) {
                  event.preventBaseUIHandler();
                  if (!actualOpen) requestOpenChange(true);
                }
              }
            : (event) => {
                event.preventBaseUIHandler();
              }
        }
      />
      {hasOpened && (
        <BasePreviewCard.Portal keepMounted>
          <BasePreviewCard.Positioner
            className={styles.positioner}
            data-owned-popover-positioner
            side={side}
            align={align}
            sideOffset={15}
            collisionPadding={collisionPadding}
            disableAnchorTracking={freezeInitialPosition}
            collisionAvoidance={{
              side: "flip",
              align: "shift",
              fallbackAxisSide: "none",
            }}
          >
            <BasePreviewCard.Popup
              data-owned-popover-popup
              className={mergeClassNames(styles.popup, className)}
            >
              <div className={styles.inner} data-owned-popover-inner>
                {title !== undefined && title !== null && (
                  <div className={styles.title} data-owned-popover-title>
                    {title}
                  </div>
                )}
                <div className={styles.content} data-owned-popover-content>
                  {content}
                </div>
              </div>
              <BasePreviewCard.Arrow
                className={styles.arrow}
                data-owned-popover-arrow
              >
                <span className={styles.arrowSurface} />
              </BasePreviewCard.Arrow>
            </BasePreviewCard.Popup>
          </BasePreviewCard.Positioner>
        </BasePreviewCard.Portal>
      )}
    </BasePreviewCard.Root>
  );
}
