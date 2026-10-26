import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./Tooltip.module.scss";

type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";

type TooltipTriggerElement = React.ReactElement & {
  ref?: React.Ref<HTMLElement>;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => setRef(ref, value));
  };
}

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  side?: TooltipSide;
  align?: TooltipAlign;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  children,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 100,
  closeDelay = 100,
  side = "top",
  align = "center",
  disabled = false,
  className,
}: TooltipProps) {
  const triggerId = React.useId();
  const popupId = React.useId();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const actualOpen = !disabled && (open ?? uncontrolledOpen);
  const childAriaDescribedBy = (
    children.props as React.HTMLAttributes<HTMLElement>
  )["aria-describedby"];
  const childRef = (children as TooltipTriggerElement).ref;
  const ariaDescribedBy = actualOpen
    ? [childAriaDescribedBy, popupId].filter(Boolean).join(" ")
    : childAriaDescribedBy;

  const requestOpenChange = (nextOpen: boolean) => {
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <BaseTooltip.Root
      open={actualOpen}
      triggerId={triggerId}
      onOpenChange={requestOpenChange}
      disabled={disabled}
    >
      <BaseTooltip.Trigger
        render={(triggerProps) => {
          const baseRef = (
            triggerProps as React.HTMLAttributes<HTMLElement> & {
              ref?: React.Ref<HTMLElement>;
            }
          ).ref;
          const mergedProps = mergeProps(
            triggerProps,
            children.props as React.HTMLAttributes<HTMLElement>,
          );

          return React.cloneElement(children, {
            ...mergedProps,
            ref: mergeRefs(baseRef, childRef),
            id: triggerId,
            "aria-describedby": ariaDescribedBy || undefined,
          });
        }}
        id={triggerId}
        aria-describedby={ariaDescribedBy || undefined}
        delay={openDelay}
        closeDelay={closeDelay}
        disabled={disabled}
      />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          className={styles.positioner}
          data-owned-tooltip-positioner
          side={side}
          align={align}
          sideOffset={13}
          alignOffset={-0.5}
          collisionAvoidance={{
            side: "flip",
            align: "shift",
            fallbackAxisSide: "none",
          }}
        >
          <BaseTooltip.Popup
            id={popupId}
            role="tooltip"
            data-owned-tooltip-popup
            className={mergeClassNames(styles.popup, className)}
          >
            <div className={styles.inner} data-owned-tooltip-inner>
              {content}
            </div>
            <BaseTooltip.Arrow
              className={styles.arrow}
              data-owned-tooltip-arrow
            >
              <span className={styles.arrowSurface} />
            </BaseTooltip.Arrow>
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
