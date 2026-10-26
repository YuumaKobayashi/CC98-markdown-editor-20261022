import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";

import { mergeClassNames } from "@foundation/lib/class-names";
import {
  addMonths,
  compareCalendarMonths,
  formatCalendarMonth,
  isSameCalendarMonth,
  type CalendarMonth,
} from "@foundation/lib/calendar-date";

import styles from "./MonthPicker.module.scss";

const MONTH_LABELS = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
] as const;

export interface MonthPickerClassNames {
  root?: string;
  trigger?: string;
  popup?: string;
}

export interface MonthPickerProps {
  value?: CalendarMonth | null;
  defaultValue?: CalendarMonth | null;
  onValueChange?: (value: CalendarMonth) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  min?: CalendarMonth;
  max?: CalendarMonth;
  currentMonth?: CalendarMonth;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  className?: string;
  classNames?: MonthPickerClassNames;
  footer?: React.ReactNode;
}

function getLocalMonth(): CalendarMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function getMonthLabel(month: CalendarMonth) {
  return `${month.year}年${MONTH_LABELS[month.month - 1]}`;
}

function isOutsideRange(
  month: CalendarMonth,
  min?: CalendarMonth,
  max?: CalendarMonth
) {
  return (
    (min !== undefined && compareCalendarMonths(month, min) < 0) ||
    (max !== undefined && compareCalendarMonths(month, max) > 0)
  );
}

function clampToRange(
  month: CalendarMonth,
  min?: CalendarMonth,
  max?: CalendarMonth
) {
  if (min && compareCalendarMonths(month, min) < 0) return { ...min };
  if (max && compareCalendarMonths(month, max) > 0) return { ...max };
  return { ...month };
}

function findEnabledMonth(
  target: CalendarMonth,
  direction: -1 | 1,
  min?: CalendarMonth,
  max?: CalendarMonth
): CalendarMonth | null {
  if (!isOutsideRange(target, min, max)) return target;
  if (min && compareCalendarMonths(target, min) < 0) {
    return direction === 1 ? { ...min } : null;
  }
  if (max && compareCalendarMonths(target, max) > 0) {
    return direction === -1 ? { ...max } : null;
  }
  return null;
}

export function MonthPicker({
  value,
  defaultValue = null,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  min,
  max,
  currentMonth,
  placeholder = "选择月份",
  disabled = false,
  ariaLabel = "选择月份",
  ariaInvalid,
  ariaDescribedBy,
  className,
  classNames,
  footer,
}: MonthPickerProps) {
  if (min && max && compareCalendarMonths(min, max) > 0) {
    throw new RangeError("Minimum month must not be after maximum month");
  }

  const isValueControlled = value !== undefined;
  const isOpenControlled = open !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<CalendarMonth | null>(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const committedValue = isValueControlled ? value : uncontrolledValue;
  const currentOpen = isOpenControlled ? open : uncontrolledOpen;
  const preferredMonth = committedValue ?? currentMonth ?? getLocalMonth();
  formatCalendarMonth(preferredMonth);
  if (currentMonth) formatCalendarMonth(currentMonth);
  const initialMonth = clampToRange(preferredMonth, min, max);
  const committedKey = committedValue
    ? formatCalendarMonth(committedValue)
    : "empty";
  const [viewYear, setViewYear] = React.useState(initialMonth.year);
  const [activeMonth, setActiveMonth] = React.useState(initialMonth);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const activeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const pendingFocusMonthRef = React.useRef<string | null>(null);
  const previousOpenRef = React.useRef(currentOpen);
  const previousCommittedKeyRef = React.useRef(committedKey);
  const popupId = React.useId();
  const gridTitleId = React.useId();

  const syncToCommitted = React.useCallback(() => {
    const nextActive = clampToRange(
      committedValue ?? currentMonth ?? getLocalMonth(),
      min,
      max
    );
    setActiveMonth(nextActive);
    setViewYear(nextActive.year);
    if (currentOpen) {
      pendingFocusMonthRef.current = formatCalendarMonth(nextActive);
    }
  }, [committedValue, currentMonth, currentOpen, max, min]);

  React.useEffect(() => {
    if (previousOpenRef.current === currentOpen) return;
    previousOpenRef.current = currentOpen;
    syncToCommitted();
  }, [currentOpen, syncToCommitted]);

  React.useEffect(() => {
    if (previousCommittedKeyRef.current === committedKey) return;
    previousCommittedKeyRef.current = committedKey;
    syncToCommitted();
  }, [committedKey, syncToCommitted]);

  React.useEffect(() => {
    if (!currentOpen) {
      pendingFocusMonthRef.current = null;
      return undefined;
    }

    const activeKey = formatCalendarMonth(activeMonth);
    if (pendingFocusMonthRef.current !== activeKey) return undefined;

    let frame = 0;
    let attempts = 0;
    const focusPendingMonth = () => {
      if (pendingFocusMonthRef.current !== activeKey) return;
      const button = activeButtonRef.current;
      if (button) button.focus({ preventScroll: true });
      attempts += 1;
      if (attempts < 2) {
        frame = window.requestAnimationFrame(focusPendingMonth);
        return;
      }
      if (button && document.activeElement === button) {
        pendingFocusMonthRef.current = null;
      }
    };

    frame = window.requestAnimationFrame(focusPendingMonth);
    return () => window.cancelAnimationFrame(frame);
  }, [activeMonth, currentOpen, viewYear]);

  const setOpen = (nextOpen: boolean) => {
    if (!isOpenControlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const commitValue = (nextValue: CalendarMonth) => {
    if (!isValueControlled) setUncontrolledValue(nextValue);
    onValueChange?.({ ...nextValue });
  };

  const selectMonth = (month: CalendarMonth) => {
    if (isOutsideRange(month, min, max)) return;
    setActiveMonth(month);
    commitValue(month);
    setOpen(false);
  };

  const moveActiveMonth = (target: CalendarMonth, direction: -1 | 1) => {
    const enabledMonth = findEnabledMonth(target, direction, min, max);
    if (!enabledMonth) return;
    pendingFocusMonthRef.current = formatCalendarMonth(enabledMonth);
    setActiveMonth(enabledMonth);
    setViewYear(enabledMonth.year);
  };

  const moveToRowEdge = (edge: "start" | "end") => {
    const rowStart = activeMonth.month - ((activeMonth.month - 1) % 3);
    const rowEnd = rowStart + 2;
    const step = edge === "start" ? 1 : -1;
    for (
      let monthNumber = edge === "start" ? rowStart : rowEnd;
      monthNumber >= rowStart && monthNumber <= rowEnd;
      monthNumber += step
    ) {
      const candidate = { year: activeMonth.year, month: monthNumber };
      if (!isOutsideRange(candidate, min, max)) {
        moveActiveMonth(candidate, step);
        return;
      }
    }
  };

  const handleGridKeyDown = (event: React.KeyboardEvent) => {
    let amount = 0;
    try {
      switch (event.key) {
        case "ArrowLeft":
          amount = -1;
          break;
        case "ArrowRight":
          amount = 1;
          break;
        case "ArrowUp":
          amount = -3;
          break;
        case "ArrowDown":
          amount = 3;
          break;
        case "Home":
          event.preventDefault();
          moveToRowEdge("start");
          return;
        case "End":
          event.preventDefault();
          moveToRowEdge("end");
          return;
        case "PageUp":
          amount = event.shiftKey ? -12 : -1;
          break;
        case "PageDown":
          amount = event.shiftKey ? 12 : 1;
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          selectMonth(activeMonth);
          return;
        case "Escape":
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          return;
        default:
          return;
      }

      event.preventDefault();
      const target = addMonths(activeMonth, amount);
      moveActiveMonth(target, amount < 0 ? -1 : 1);
    } catch {
      return;
    }
  };

  const navigateYear = (amount: -1 | 1) => {
    const nextYear = viewYear + amount;
    if (nextYear < 1 || nextYear > 9999) return;
    const target = clampToRange(
      { year: nextYear, month: activeMonth.month },
      min,
      max
    );
    if (target.year !== nextYear) return;
    setViewYear(nextYear);
    setActiveMonth(target);
  };

  const canNavigateToYear = (year: number) =>
    year >= 1 &&
    year <= 9999 &&
    (!min || year >= min.year) &&
    (!max || year <= max.year);

  const defaultFooter = currentMonth ? (
    <button
      className={styles.currentMonthButton}
      type="button"
      disabled={isOutsideRange(currentMonth, min, max)}
      onClick={() => selectMonth(currentMonth)}
    >
      本月
    </button>
  ) : null;

  return (
    <BasePopover.Root open={currentOpen} onOpenChange={setOpen} modal={false}>
      <span
        className={mergeClassNames(styles.root, className, classNames?.root)}
        data-disabled={disabled || undefined}
      >
        <BasePopover.Trigger
          ref={triggerRef}
          className={mergeClassNames(styles.trigger, classNames?.trigger)}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={currentOpen}
          aria-controls={popupId}
          aria-invalid={ariaInvalid || undefined}
          aria-describedby={ariaDescribedBy}
        >
          <span className={mergeClassNames(styles.triggerText, !committedValue && styles.placeholder)}>
            {committedValue ? formatCalendarMonth(committedValue) : placeholder}
          </span>
          <span className={styles.calendarIcon} aria-hidden="true" />
        </BasePopover.Trigger>
      </span>
      <BasePopover.Portal>
        <BasePopover.Positioner
          className={styles.positioner}
          side="bottom"
          align="start"
          sideOffset={-35}
          alignOffset={-0.5}
          collisionPadding={8}
        >
          <BasePopover.Popup
            ref={popupRef}
            id={popupId}
            className={mergeClassNames(styles.popup, classNames?.popup)}
            role="dialog"
            aria-label="选择月份"
            initialFocus={() => activeButtonRef.current ?? popupRef.current}
            finalFocus={triggerRef}
          >
            <div className={styles.content}>
              <div className={styles.panel}>
                <div className={styles.header}>
                  <button
                    className={mergeClassNames(styles.navigation, styles.previousYear)}
                    type="button"
                    aria-label="上一年"
                    disabled={!canNavigateToYear(viewYear - 1)}
                    onClick={() => navigateYear(-1)}
                  />
                  <div id={gridTitleId} className={styles.yearTitle}>
                    {viewYear}
                  </div>
                  <button
                    className={mergeClassNames(styles.navigation, styles.nextYear)}
                    type="button"
                    aria-label="下一年"
                    disabled={!canNavigateToYear(viewYear + 1)}
                    onClick={() => navigateYear(1)}
                  />
                </div>
                <div
                  className={styles.monthGrid}
                  role="grid"
                  aria-labelledby={gridTitleId}
                  onKeyDown={handleGridKeyDown}
                >
                  {MONTH_LABELS.map((label, index) => {
                    const month = { year: viewYear, month: index + 1 };
                    const monthDisabled = isOutsideRange(month, min, max);
                    const selected =
                      committedValue !== null &&
                      isSameCalendarMonth(month, committedValue);
                    const active =
                      !monthDisabled && isSameCalendarMonth(month, activeMonth);
                    return (
                      <div
                        key={label}
                        className={styles.monthCell}
                        role="gridcell"
                        aria-selected={selected || undefined}
                      >
                        <button
                          ref={active ? activeButtonRef : undefined}
                          className={mergeClassNames(
                            styles.monthButton,
                            selected && styles.selectedMonth
                          )}
                          type="button"
                          disabled={monthDisabled}
                          tabIndex={active ? 0 : -1}
                          aria-label={getMonthLabel(month)}
                          onClick={() => selectMonth(month)}
                          onFocus={() => setActiveMonth(month)}
                        >
                          {label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.footer}>
                {footer !== undefined ? footer : defaultFooter}
              </div>
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
