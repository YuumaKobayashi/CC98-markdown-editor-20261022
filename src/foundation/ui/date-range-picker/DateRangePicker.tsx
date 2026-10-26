import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";

import { mergeClassNames } from "@foundation/lib/class-names";
import {
  addDays,
  addMonths,
  compareCalendarDates,
  dayOfWeek,
  daysInMonth,
  formatCalendarDate,
  isSameCalendarDate,
  isSameCalendarMonth,
  parseCalendarDate,
  toMonth,
  type CalendarDate,
  type CalendarDateRange,
  type CalendarMonth,
} from "@foundation/lib/calendar-date";

import styles from "./DateRangePicker.module.scss";

export interface DateRangePickerProps {
  value?: CalendarDateRange | null;
  defaultValue?: CalendarDateRange | null;
  onValueChange?: (value: CalendarDateRange | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  allowClear?: boolean;
  disabled?: boolean;
  disabledDate?: (date: CalendarDate) => boolean;
  placeholder?: readonly [string, string];
  ariaLabel?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  footer?: React.ReactNode;
  className?: string;
}

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];
const MAX_ACTIVE_DATE_SEARCH_DAYS = 3660;

function getToday(): CalendarDate {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

function normalizeRange(
  first: CalendarDate,
  second: CalendarDate
): CalendarDateRange {
  return compareCalendarDates(first, second) <= 0
    ? [first, second]
    : [second, first];
}

function normalizeLeftMonth(month: CalendarMonth): CalendarMonth {
  if (month.year === 9999 && month.month === 12) {
    return { year: 9999, month: 11 };
  }
  return month;
}

function firstDateOfMonth(month: CalendarMonth): CalendarDate {
  return { ...month, day: 1 };
}

function lastDateOfMonth(month: CalendarMonth): CalendarDate {
  return { ...month, day: daysInMonth(month) };
}

function getMonthDates(month: CalendarMonth) {
  const firstDate = firstDateOfMonth(month);
  const leadingDays = (dayOfWeek(firstDate) + 6) % 7;
  return Array.from({ length: 42 }, (_, index): CalendarDate | null => {
    try {
      return addDays(firstDate, index - leadingDays);
    } catch {
      return null;
    }
  });
}

function isDateInRange(
  date: CalendarDate,
  range: CalendarDateRange | null
) {
  return (
    range !== null &&
    compareCalendarDates(date, range[0]) >= 0 &&
    compareCalendarDates(date, range[1]) <= 0
  );
}

function getDateLabel(date: CalendarDate) {
  return `${date.year}年${date.month}月${date.day}日`;
}

function getRangeKey(value: CalendarDateRange | null) {
  return value
    ? `${formatCalendarDate(value[0])}/${formatCalendarDate(value[1])}`
    : "empty";
}

function getDraftKey(start: CalendarDate | null, end: CalendarDate | null) {
  if (!start && !end) return "empty";
  if (start && end) return getRangeKey(normalizeRange(start, end));
  return `partial:${start ? formatCalendarDate(start) : ""}/${end ? formatCalendarDate(end) : ""}`;
}

function findNearestEnabledDate(
  target: CalendarDate,
  disabledDate?: (date: CalendarDate) => boolean
): CalendarDate | null {
  if (!disabledDate?.(target)) return target;

  let canSearchBefore = true;
  let canSearchAfter = true;
  for (let distance = 1; distance <= MAX_ACTIVE_DATE_SEARCH_DAYS; distance += 1) {
    if (canSearchAfter) {
      try {
        const after = addDays(target, distance);
        if (!disabledDate(after)) return after;
      } catch {
        canSearchAfter = false;
      }
    }
    if (canSearchBefore) {
      try {
        const before = addDays(target, -distance);
        if (!disabledDate(before)) return before;
      } catch {
        canSearchBefore = false;
      }
    }
    if (!canSearchBefore && !canSearchAfter) break;
  }
  return null;
}

export function DateRangePicker({
  value,
  defaultValue = null,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  allowClear = true,
  disabled = false,
  disabledDate,
  placeholder = ["开始日期", "结束日期"],
  ariaLabel = "选择日期范围",
  ariaInvalid,
  ariaDescribedBy,
  footer,
  className,
}: DateRangePickerProps) {
  const isValueControlled = value !== undefined;
  const isOpenControlled = open !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<CalendarDateRange | null>(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const committedValue = isValueControlled ? value : uncontrolledValue;
  const currentOpen = isOpenControlled ? open : uncontrolledOpen;
  const preferredInitialDate = committedValue?.[0] ?? getToday();
  const initialDate =
    findNearestEnabledDate(preferredInitialDate, disabledDate) ??
    preferredInitialDate;
  const committedKey = getRangeKey(committedValue);
  const [viewMonth, setViewMonth] = React.useState<CalendarMonth>(() =>
    normalizeLeftMonth(toMonth(initialDate))
  );
  const [draftStart, setDraftStart] = React.useState<CalendarDate | null>(
    committedValue?.[0] ?? null
  );
  const [draftEnd, setDraftEnd] = React.useState<CalendarDate | null>(
    committedValue?.[1] ?? null
  );
  const [hoveredDate, setHoveredDate] = React.useState<CalendarDate | null>(null);
  const [activeDate, setActiveDate] = React.useState<CalendarDate>(initialDate);
  const [startInput, setStartInput] = React.useState(
    committedValue ? formatCalendarDate(committedValue[0]) : ""
  );
  const [endInput, setEndInput] = React.useState(
    committedValue ? formatCalendarDate(committedValue[1]) : ""
  );
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const activeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const pendingFocusDateRef = React.useRef<string | null>(null);
  const previousOpenRef = React.useRef(currentOpen);
  const previousCommittedKeyRef = React.useRef(committedKey);
  const popupId = React.useId();
  const leftMonthTitleId = React.useId();
  const rightMonthTitleId = React.useId();
  const today = React.useMemo(getToday, []);
  const rightMonth = addMonths(viewMonth, 1);

  const isDisabled = React.useCallback(
    (date: CalendarDate) => disabledDate?.(date) ?? false,
    [disabledDate]
  );

  const syncDraftToCommitted = React.useCallback(() => {
    const start = committedValue?.[0] ?? null;
    const end = committedValue?.[1] ?? null;
    const preferredFocusDate = start ?? today;
    const focusDate =
      findNearestEnabledDate(preferredFocusDate, disabledDate) ??
      preferredFocusDate;
    setDraftStart(start);
    setDraftEnd(end);
    setHoveredDate(null);
    setActiveDate(focusDate);
    setStartInput(start ? formatCalendarDate(start) : "");
    setEndInput(end ? formatCalendarDate(end) : "");
    setViewMonth(normalizeLeftMonth(toMonth(focusDate)));
    if (currentOpen && !disabledDate?.(focusDate)) {
      pendingFocusDateRef.current = formatCalendarDate(focusDate);
    }
  }, [committedValue, currentOpen, disabledDate, today]);

  React.useEffect(() => {
    if (previousOpenRef.current === currentOpen) return;
    previousOpenRef.current = currentOpen;
    syncDraftToCommitted();
  }, [currentOpen, syncDraftToCommitted]);

  React.useEffect(() => {
    if (previousCommittedKeyRef.current === committedKey) return;
    previousCommittedKeyRef.current = committedKey;
    if (currentOpen && getDraftKey(draftStart, draftEnd) === committedKey) {
      return;
    }
    syncDraftToCommitted();
  }, [
    committedKey,
    currentOpen,
    draftEnd,
    draftStart,
    syncDraftToCommitted,
  ]);

  React.useEffect(() => {
    if (!currentOpen || !isDisabled(activeDate)) return;
    const enabledDate = findNearestEnabledDate(activeDate, disabledDate);
    if (!enabledDate) return;
    setActiveDate(enabledDate);
    setViewMonth(normalizeLeftMonth(toMonth(enabledDate)));
    pendingFocusDateRef.current = formatCalendarDate(enabledDate);
  }, [activeDate, currentOpen, disabledDate, isDisabled]);

  React.useEffect(() => {
    if (!currentOpen) {
      pendingFocusDateRef.current = null;
      return undefined;
    }

    const activeDateKey = formatCalendarDate(activeDate);
    if (pendingFocusDateRef.current !== activeDateKey) return undefined;

    // Month changes may commit separately and cancel the first scheduled frame.
    let frame = 0;
    let attempts = 0;
    const focusPendingDate = () => {
      if (pendingFocusDateRef.current !== activeDateKey) return;

      const button = activeButtonRef.current;
      if (button) button.focus({ preventScroll: true });
      attempts += 1;

      if (attempts < 2) {
        frame = window.requestAnimationFrame(focusPendingDate);
        return;
      }
      if (button && document.activeElement === button) {
        pendingFocusDateRef.current = null;
      }
    };

    frame = window.requestAnimationFrame(focusPendingDate);
    return () => window.cancelAnimationFrame(frame);
  }, [activeDate, currentOpen, viewMonth]);

  const setOpen = (nextOpen: boolean) => {
    if (!isOpenControlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const commitValue = (nextValue: CalendarDateRange | null) => {
    if (!isValueControlled) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const findEnabledDate = (
    target: CalendarDate,
    direction: -1 | 1
  ): CalendarDate | null => {
    let candidate = target;
    for (let index = 0; index < 367; index += 1) {
      if (!isDisabled(candidate)) return candidate;
      try {
        candidate = addDays(candidate, direction);
      } catch {
        return null;
      }
    }
    return null;
  };

  const showDate = (date: CalendarDate) => {
    const leftStart = firstDateOfMonth(viewMonth);
    const rightEnd = lastDateOfMonth(rightMonth);
    if (compareCalendarDates(date, leftStart) < 0) {
      setViewMonth(normalizeLeftMonth(toMonth(date)));
    } else if (compareCalendarDates(date, rightEnd) > 0) {
      setViewMonth(normalizeLeftMonth(addMonths(toMonth(date), -1)));
    }
  };

  const moveActiveDate = (target: CalendarDate, direction: -1 | 1) => {
    const enabledDate = findEnabledDate(target, direction);
    if (!enabledDate) return;
    pendingFocusDateRef.current = formatCalendarDate(enabledDate);
    setActiveDate(enabledDate);
    showDate(enabledDate);
  };

  const selectDate = (date: CalendarDate) => {
    if (isDisabled(date)) return;
    setActiveDate(date);
    showDate(date);
    if (draftStart !== null && draftEnd === null) {
      const range = normalizeRange(draftStart, date);
      setDraftStart(range[0]);
      setDraftEnd(range[1]);
      setStartInput(formatCalendarDate(range[0]));
      setEndInput(formatCalendarDate(range[1]));
      setHoveredDate(null);
      commitValue(range);
      setOpen(false);
      return;
    }

    setDraftStart(date);
    setDraftEnd(null);
    setStartInput(formatCalendarDate(date));
    setEndInput("");
    setHoveredDate(null);
  };

  const navigateView = (amount: number) => {
    let nextView: CalendarMonth;
    try {
      nextView = normalizeLeftMonth(addMonths(viewMonth, amount));
    } catch {
      return;
    }
    setViewMonth(nextView);
    const target = {
      ...nextView,
      day: Math.min(activeDate.day, daysInMonth(nextView)),
    };
    const enabledDate = findEnabledDate(target, amount < 0 ? -1 : 1);
    if (enabledDate) setActiveDate(enabledDate);
  };

  const handleCalendarKeyDown = (event: React.KeyboardEvent) => {
    let target: CalendarDate | null = null;
    let direction: -1 | 1 = 1;
    try {
      switch (event.key) {
        case "ArrowLeft":
          target = addDays(activeDate, -1);
          direction = -1;
          break;
        case "ArrowRight":
          target = addDays(activeDate, 1);
          break;
        case "ArrowUp":
          target = addDays(activeDate, -7);
          direction = -1;
          break;
        case "ArrowDown":
          target = addDays(activeDate, 7);
          break;
        case "Home":
          target = addDays(activeDate, -((dayOfWeek(activeDate) + 6) % 7));
          direction = -1;
          break;
        case "End":
          target = addDays(activeDate, 6 - ((dayOfWeek(activeDate) + 6) % 7));
          break;
        case "PageUp":
          target = addMonths(activeDate, event.shiftKey ? -12 : -1);
          direction = -1;
          break;
        case "PageDown":
          target = addMonths(activeDate, event.shiftKey ? 12 : 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          selectDate(activeDate);
          return;
        case "Escape":
          event.preventDefault();
          event.stopPropagation();
          handleOpenChange(false);
          return;
        default:
          return;
      }
    } catch {
      return;
    }
    event.preventDefault();
    if (target) moveActiveDate(target, direction);
  };

  const applyTypedDate = (side: "start" | "end", commit: boolean) => {
    const parsed = parseCalendarDate(side === "start" ? startInput : endInput);
    if (!parsed || isDisabled(parsed)) return;
    setActiveDate(parsed);
    showDate(parsed);

    const nextStart = side === "start" ? parsed : draftStart;
    const nextEnd = side === "end" ? parsed : draftEnd;
    setDraftStart(nextStart);
    setDraftEnd(nextEnd);
    if (!commit || !nextStart || !nextEnd) return;

    const range = normalizeRange(nextStart, nextEnd);
    setDraftStart(range[0]);
    setDraftEnd(range[1]);
    setStartInput(formatCalendarDate(range[0]));
    setEndInput(formatCalendarDate(range[1]));
    commitValue(range);
    setOpen(false);
  };

  const displayRange = React.useMemo<CalendarDateRange | null>(() => {
    if (!draftStart) return null;
    if (draftEnd) return normalizeRange(draftStart, draftEnd);
    if (hoveredDate) return normalizeRange(draftStart, hoveredDate);
    return [draftStart, draftStart];
  }, [draftEnd, draftStart, hoveredDate]);

  const renderPanel = (
    month: CalendarMonth,
    side: "left" | "right"
  ) => {
    const titleId = side === "left" ? leftMonthTitleId : rightMonthTitleId;
    const isLeft = side === "left";
    const inputValue = isLeft ? startInput : endInput;
    const inputPlaceholder = isLeft ? placeholder[0] : placeholder[1];
    const dates = getMonthDates(month);
    return (
      <section className={styles.panel} aria-label={isLeft ? "开始月份" : "结束月份"}>
        <div className={styles.inputWrap}>
          <input
            className={styles.calendarInput}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-label={isLeft ? "开始日期" : "结束日期"}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(event) => {
              if (isLeft) setStartInput(event.target.value);
              else setEndInput(event.target.value);
            }}
            onBlur={() => applyTypedDate(isLeft ? "start" : "end", false)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyTypedDate(isLeft ? "start" : "end", true);
              }
            }}
          />
          {isLeft ? (
            <span className={styles.inputSeparator} aria-hidden="true">~</span>
          ) : null}
        </div>
        <div className={styles.header}>
          {isLeft ? (
            <div className={styles.previousControls}>
              <button
                className={mergeClassNames(styles.navigation, styles.doublePrevious)}
                type="button"
                aria-label="上一年"
                onClick={() => navigateView(-12)}
              />
              <button
                className={mergeClassNames(styles.navigation, styles.previous)}
                type="button"
                aria-label="上一月"
                onClick={() => navigateView(-1)}
              />
            </div>
          ) : null}
          <div id={titleId} className={styles.monthTitle}>
            <span>{month.year}年</span>
            <span>{month.month}月</span>
          </div>
          {!isLeft ? (
            <div className={styles.nextControls}>
              <button
                className={mergeClassNames(styles.navigation, styles.next)}
                type="button"
                aria-label="下一月"
                onClick={() => navigateView(1)}
              />
              <button
                className={mergeClassNames(styles.navigation, styles.doubleNext)}
                type="button"
                aria-label="下一年"
                onClick={() => navigateView(12)}
              />
            </div>
          ) : null}
        </div>
        <div className={styles.body}>
          <table
            className={styles.table}
            role="grid"
            aria-labelledby={titleId}
            onKeyDown={handleCalendarKeyDown}
          >
            <thead>
              <tr role="row">
                {WEEKDAYS.map((weekday) => (
                  <th key={weekday} role="columnheader" scope="col">
                    {weekday}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, rowIndex) => (
                <tr key={rowIndex} role="row">
                  {dates.slice(rowIndex * 7, rowIndex * 7 + 7).map((date, cellIndex) => {
                    if (!date) {
                      return <td key={cellIndex} role="gridcell" />;
                    }
                    const inCurrentMonth = isSameCalendarMonth(date, month);
                    const dateDisabled = isDisabled(date);
                    const isStart = draftStart !== null && isSameCalendarDate(date, draftStart);
                    const isEnd = draftEnd !== null && isSameCalendarDate(date, draftEnd);
                    const isEndpoint = isStart || isEnd;
                    const inRange = isDateInRange(date, displayRange) && !isEndpoint;
                    const isToday = isSameCalendarDate(date, today);
                    const isActive =
                      inCurrentMonth &&
                      !dateDisabled &&
                      isSameCalendarDate(date, activeDate);
                    return (
                      <td
                        key={formatCalendarDate(date)}
                        className={mergeClassNames(
                          styles.cell,
                          !inCurrentMonth && styles.outsideMonth,
                          inRange && styles.inRange,
                          isEndpoint && styles.endpoint,
                          isToday && styles.today,
                          dateDisabled && styles.disabledDate
                        )}
                        role="gridcell"
                        aria-selected={isEndpoint || inRange || undefined}
                      >
                        <button
                          ref={isActive ? activeButtonRef : undefined}
                          className={styles.date}
                          type="button"
                          disabled={dateDisabled}
                          tabIndex={isActive ? 0 : -1}
                          aria-label={getDateLabel(date)}
                          aria-current={isToday ? "date" : undefined}
                          onClick={() => selectDate(date)}
                          onFocus={() => setActiveDate(date)}
                          onMouseEnter={() => {
                            if (draftStart && !draftEnd && !dateDisabled) {
                              setHoveredDate(date);
                            }
                          }}
                          onMouseLeave={() => setHoveredDate(null)}
                        >
                          {date.day}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  const hasValue = committedValue !== null;
  return (
    <BasePopover.Root
      open={currentOpen}
      onOpenChange={(nextOpen) => handleOpenChange(nextOpen)}
      modal={false}
    >
      <span
        className={mergeClassNames(styles.root, className)}
        data-disabled={disabled || undefined}
      >
        <BasePopover.Trigger
          ref={triggerRef}
          className={styles.trigger}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={currentOpen}
          aria-controls={popupId}
          aria-invalid={ariaInvalid || undefined}
          aria-describedby={ariaDescribedBy}
          onKeyDown={(event) => {
            if ((event.key === "Backspace" || event.key === "Delete") && allowClear && hasValue) {
              event.preventDefault();
              commitValue(null);
            }
          }}
        >
          <span className={mergeClassNames(styles.triggerValue, !hasValue && styles.placeholder)}>
            {committedValue ? formatCalendarDate(committedValue[0]) : placeholder[0]}
          </span>
          <span className={styles.separator}>~</span>
          <span className={mergeClassNames(styles.triggerValue, !hasValue && styles.placeholder)}>
            {committedValue ? formatCalendarDate(committedValue[1]) : placeholder[1]}
          </span>
          <span className={styles.calendarIcon} aria-hidden="true" />
        </BasePopover.Trigger>
        {allowClear && hasValue && !disabled ? (
          <button
            className={styles.clear}
            type="button"
            aria-label="清除日期范围"
            onClick={(event) => {
              event.stopPropagation();
              commitValue(null);
              setOpen(false);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </span>
      <BasePopover.Portal>
        <BasePopover.Positioner
          className={styles.positioner}
          side="bottom"
          align="start"
          sideOffset={-36}
          alignOffset={-1}
          collisionPadding={8}
        >
          <BasePopover.Popup
            ref={popupRef}
            id={popupId}
            className={styles.popup}
            role="dialog"
            aria-label="选择有效时间"
            initialFocus={() => activeButtonRef.current ?? popupRef.current}
            finalFocus={triggerRef}
          >
            <div className={styles.calendarContent}>
              <div className={styles.panels}>
                {renderPanel(viewMonth, "left")}
                {renderPanel(rightMonth, "right")}
              </div>
              <div className={styles.footer}>{footer}</div>
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
